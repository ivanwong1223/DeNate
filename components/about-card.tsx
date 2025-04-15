import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";
import React from "react";

interface AboutCardProp {
  title: string;
  subTitle: string;
  description: React.ReactNode;
}

export function AboutCard({ title, description, subTitle }: AboutCardProp) {
  const buttonText =
    title === "For Donors" ? "Become a Donor" :
      title === "For Organizations" ? "Register Organization" :
        title === "Get to know us!" ? "About Us" : "About Us";

  const buttonLink =
    title === "For Donors" ? "/login" :
      title === "For Organizations" ? "/kyb-form" :
        title === "Get to know us!" ? "/about" : "/about";

  // Determine background image based on title
  const getBackgroundStyle = () => {
    if (title === "For Donors") {
      return {
        backgroundImage: "url('/donors.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay"
      };
    } else if (title === "For Organizations") {
      return {
        backgroundImage: "url('/charity.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay"
      };
    } else if (title === "Get to know us!") {
      return {
        backgroundImage: "url('/about-us-card.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay"
      };
    }
    return {};
  };

  return (
    <Card shadow={false} placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      <CardBody
        className="h-[453px] p-5 flex flex-col justify-center items-center rounded-2xl"
        style={getBackgroundStyle()}
        placeholder={null}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="absolute inset-0 bg-gray-900/70 rounded-2xl" />

        <div className="relative z-10 flex flex-col items-center">
          <Typography variant="h6" className="mb-4 text-center" color="white" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            {subTitle}
          </Typography>
          <Typography variant="h4" className="text-center" color="white" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            {title}
          </Typography>
          <div className="mt-6 mb-10 text-base w-full lg:w-10/12 text-center font-normal text-white">
            {description}
          </div>
          <Link href={buttonLink} passHref>
            <Button color="white" size="sm" placeholder={null} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {buttonText}
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

export default AboutCard;

