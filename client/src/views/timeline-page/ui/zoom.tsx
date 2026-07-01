import { GlassSlider } from "@/shared/ui/slider";

interface ZoomProps {
  value: number;
  onValueChange: (value: number) => void;
}

const Zoom = ({ value, onValueChange }: ZoomProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 w-full">
      <p className="leading-none mb-0  min-w-20">Zoom level</p>
      <GlassSlider
        className="w-full"
        value={value}
        onValueChange={onValueChange}
        colorA={"#06D6A0"}
        colorB={"#5B8FF9"}
        delay={0.08 + 1 * 0.06}
      />
    </div>
  );
};

export default Zoom;
