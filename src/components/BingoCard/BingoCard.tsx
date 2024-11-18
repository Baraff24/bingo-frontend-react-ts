import React from "react";
import Popup from "react-animated-popup";
import BingoCardBackgroundImage from "../../assets/images/bingo-card-background.png";
import { BingoCardType } from "../../types/bingo";

interface BingoCardProps {
  card: BingoCardType;
  visible: boolean;
  onClose: () => void;
}

const BingoCardComponent: React.FC<BingoCardProps> = ({ card, visible, onClose }) => {
  return (
    <div
      className="relative bg-cover bg-center rounded-lg shadow-lg p-4 m-4 w-full sm:w-1/2 lg:w-1/3"
      style={{ backgroundImage: `url(${BingoCardBackgroundImage})` }}
    >
      <Popup visible={visible} onClose={onClose}>
        <p className="text-red-500 font-bold text-xl">TOMBOLA!</p>
      </Popup>

      <p className="text-white text-left font-bold mb-2">{card.card_id}</p>

      <div className="grid grid-cols-5 gap-2">
        {card.card.map((row, rowIndex) => (
          <div className="flex justify-center" key={rowIndex}>
            {row.map((cell) => (
              <div
                key={cell.number}
                className={`w-12 h-12 flex items-center justify-center bg-white rounded-md ${
                  cell.number === "0" ? "bg-transparent" : ""
                }`}
              >
                <button
                  className={`w-full h-full flex items-center justify-center rounded-md text-lg font-bold ${
                    cell.crossed_out
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-200"
                  }`}
                  disabled={cell.crossed_out}
                  aria-label={cell.crossed_out ? `Numero ${cell.number} segnato` : `Numero ${cell.number}`}
                >
                  {cell.number}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoCardComponent;
