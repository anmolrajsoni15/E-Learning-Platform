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

const CourseEnrollButton = ({ price, courseId }: Props) => {
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
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
