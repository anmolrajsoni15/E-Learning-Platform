import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Mux from '@mux/mux-node';
import axios from 'axios';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

// Webhook POST handler
export async function POST(req: NextRequest) {
  try {

    // Read the raw body and parse it as JSON
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const header = req.headers.get('mux-signature') || '';


    // Verify Mux Signature
    const secret = process.env.MUX_WEBHOOK_SECRET || '';
    const isVerified = Mux.Webhooks.verifyHeader(rawBody, header, secret);
    // const isVerified = verifyMuxSignature(req, secret);
    if (!isVerified) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    

    // Handle the webhook event
    const event = body;

    if(event.type === 'video.asset.ready') {
      const video = await Video.Assets.get(event.data.id);
      const videoData = JSON.parse(video.passthrough || "{}");
      const chapterId = videoData.chapterId;
      const videoDuration = Math.round(video.duration || 0);

      const updateChapter = await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          videoLength: Math.round((videoDuration / 3600) * 1000) / 1000,
        },
      });
      
      return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
    }

    // Respond to Mux
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    // In case of an error, return a 500 Internal Server Error
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
