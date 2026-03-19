
import custsorSvg from "../../../public/assets/img/property/property-details-1/cursor.svg";
import React, { useEffect, useRef } from "react";
import useGlobalContext from "../../hooks/useContext";
import Image from "next/image";

const AnimateMouse: React.FC = () => {
  const { isEnter } = useGlobalContext();
  const eRef = useRef<HTMLDivElement>(null);
  const tRef = useRef<HTMLDivElement>(null);
  const nRef = useRef<number>(0);
  const iRef = useRef<number>(0);

  const oRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (s: MouseEvent) => {
      if (!oRef.current) {
        if (tRef.current) {
          tRef.current.style.transform = `translate(${s.clientX}px, ${s.clientY}px)`;
        }
      }
      if (eRef.current) {
        eRef.current.style.transform = `translate(${s.clientX}px, ${s.clientY}px)`;
      }
      nRef.current = s.clientY;
      iRef.current = s.clientX;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={eRef}
        style={{ visibility: "visible" }}
        className={`mouseCursor cursor-outer ${isEnter ? "cursor-big" : ""}`}
      ></div>
      <div
        ref={tRef}
        className={`mouseCursor cursor-inner ${isEnter ? "cursor-big" : ""}`}
        style={{ visibility: "visible" }}
      >
        <span><Image src={custsorSvg} alt="cursor svg" /></span>
      </div>
    </>
  );
};

export default AnimateMouse;

