import React from "react";
import BingoCardBackgroundImage from "../../assets/images/bingo-card-background.png";
import { BingoCardType } from "../../types/bingo";

interface BingoCardProps {
  card: BingoCardType;
  visible: boolean;
  onClose: () => void;
}

const BingoCardComponent: React.FC<BingoCardProps> = ({ card }) => {
  return (
      <div
          className="relative bg-cover bg-center rounded-xl shadow-lg p-6 m-2 w-full sm:w-1/2 xl:w-1/3 flex flex-col items-center"
          style={{backgroundImage: `url(${BingoCardBackgroundImage})`}}
      >

        <div className="flex justify-start w-full mb-4">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-bold">{card.card_id}</span>
          </div>
        </div>

        {/* Griglia del Bingo */}
        <div className="flex flex-col space-y-2 w-full">
          {card.card.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-2">
                {row.map((cell, cellIndex) => {
                  const isEmpty = cell.number === "0";
                  const isSelected = cell.crossed_out;

                  return (
                      <div
                          key={`${rowIndex}-${cellIndex}`}
                          className={`flex items-center justify-center rounded-md border-2 border-blue-600 ${
                              isEmpty ? "bg-transparent w-10 h-10 md:w-12 md:h-12" : "bg-white w-10 h-10 md:w-12 md:h-12"
                          } transition-all duration-200`}
                      >
                        <button
                            disabled={isEmpty}
                            className={`w-full h-full flex items-center justify-center rounded-md font-bold text-sm md:text-base ${
                                isEmpty
                                    ? "cursor-not-allowed bg-black text-black"
                                    : isSelected
                                        ? "bg-blue-700 text-white border-2 border-white"
                                        : "bg-transparent text-slate-700"
                            }`}
                            aria-label={
                              isEmpty
                                  ? "Cella vuota"
                                  : isSelected
                                      ? `Numero ${cell.number} già selezionato`
                                      : `Seleziona numero ${cell.number}`
                            }
                        >
                          {!isEmpty && cell.number}
                        </button>
                      </div>
                  );
                })}
              </div>
          ))}
        </div>
      </div>
  );
};

export default BingoCardComponent;
