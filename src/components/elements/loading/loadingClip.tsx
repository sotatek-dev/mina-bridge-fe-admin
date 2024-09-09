type Props = {
  id: string;
  w?: number;
  h?: number;
  tn?: number;
};

export default function LoadingClip({ id, w = 100, h = 100, tn = 5 }: Props) {
  const a = 100 / w; // aspect
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill={"none"}
    >
      <defs>
        <clipPath id={id}>
          {/* top */}
          <rect
            x={48 / a}
            y={0 / a}
            width={tn / a}
            height={22 / a}
            rx={3 / a}
            ry={3 / a}
          />
          {/* top right */}
          <rect
            x={28.5 / a}
            y={67.5 / a}
            width={22 / a}
            height={tn / a}
            rx={3 / a}
            ry={3 / a}
            transform={"rotate(-45)"}
          />

          {/* right */}
          <rect
            x={78 / a}
            y={47.5 / a}
            width={22 / a}
            height={tn / a}
            rx={3 / a}
            ry={3 / a}
          />
          {/* bottom right */}
          <rect
            x={-120 / a}
            y={-1 / a}
            width={22 / a}
            height={tn / a}
            rx={3 / a}
            ry={3 / a}
            transform={"rotate(-135)"}
          />
          {/* bottom */}
          <rect
            x={48 / a}
            y={78 / a}
            width={tn / a}
            height={22 / a}
            rx={3 / a}
            ry={3 / a}
          />
          <rect
            x={27 / a}
            y={-74.5 / a}
            width={22 / a}
            height={tn / a}
            rx={3 / a}
            ry={3 / a}
            transform={"rotate(135)"}
          />
          {/* left */}
          <rect
            x={0 / a}
            y={47.5 / a}
            width={22 / a}
            height={tn / a}
            rx={3 / a}
            ry={3 / a}
          />
          {/* top left */}
          <rect
            x={20.5 / a}
            y={-3 / a}
            width={22 / a}
            height={tn / a}
            rx={3 / a}
            ry={3 / a}
            transform={"rotate(45)"}
          />
        </clipPath>
      </defs>
    </svg>
  );
}
