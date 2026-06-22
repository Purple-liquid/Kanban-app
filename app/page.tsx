import Board from "../components/Board/Board";

export default function Home() {
  return <div className="flex overflow-x-auto gap-4 p-4 scrollbar-thin snap-x snap-mandatory">
    <Board />
  </div>;
}
