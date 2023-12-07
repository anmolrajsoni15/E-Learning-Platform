"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

interface Props {
  price: number;
  courseId: string;
}

const EnrollButton = ({ price, courseId }: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className="w-full text-[#344054] text-base font-semibold"
      variant="simple"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default EnrollButton;
