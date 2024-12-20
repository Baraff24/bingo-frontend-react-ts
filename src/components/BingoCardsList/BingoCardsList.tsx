import React, { useState, useEffect, useCallback, FormEvent } from "react";
import {
    BingoCardSchema,
    BingoBallSchema,
    BingoBall,
    BingoCardType,
    BingoCell,
} from "../../types/bingo";
import {
    API_URL_BINGO_CARDS_LIST,
    API_URL_BINGO_BALLS_LIST,
} from "../../constants";
import { z } from "zod";
import { useDataFetching } from "../../hooks/dataFetcher";
import {BingoCard} from "../index.ts";

const BingoCardsList: React.FC = () => {
    // Local state for the search term (player ID) and visibility of the tombola popup
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [playerId, setPlayerId] = useState<string | null>(null); // Player ID state
    const [visible, setVisible] = useState<boolean>(false); // Popup visibility state

    /**
     * Construct the Bingo Cards API URL with playerId as a query parameter.
     * If playerId is not set, the URL is null to prevent fetching.
     */
    const bingoCardsUrl = playerId
        ? `${API_URL_BINGO_CARDS_LIST}?search=${playerId}`
        : null;

    /**
     * Hook to fetch Bingo Cards data.
     * The fetch is conditional based on the presence of playerId.
     */
    const {
        data: bingoCardsData,
        error: bingoCardsError,
        isLoading: bingoCardsLoading,
        mutate: mutateBingoCards,
    } = useDataFetching<BingoCardType[]>(bingoCardsUrl, z.array(BingoCardSchema));

    /**
     * Hook to fetch Bingo Balls data.
     */
    const {
        data: bingoBallsData,
        error: bingoBallsError,
        isLoading: bingoBallsLoading,
        mutate: mutateBingoBalls,
    } = useDataFetching<BingoBall[]>(API_URL_BINGO_BALLS_LIST, z.array(BingoBallSchema));

    /**
     * Function to load Bingo Cards data by setting the playerId.
     * This triggers the useDataFetching hook to fetch data with the new playerId.
     */
    const loadData = useCallback(() => {
        setPlayerId(searchTerm.trim());
        // No need to call mutateBingoCards() here as setting playerId will trigger a refetch
    }, [searchTerm]);

    /**
     * Function to update Bingo Cards based on the numbers extracted.
     * This function marks the numbers as crossed out and checks for tombola.
     * @param ballNumbers - Array of numbers that have been drawn.
     */
    const updateCardData = useCallback(
        (ballNumbers: string[]) => {
            if (bingoCardsData && bingoBallsData) {
                let tombola = true;

                // Update each card based on the drawn ball numbers
                const updatedCards = bingoCardsData.map((whole_card) => {
                    const updatedCard: BingoCardType = { ...whole_card };
                    updatedCard.card = updatedCard.card.map((row: BingoCell[]) =>
                        row.map((cell) => {
                            if (
                                !cell.crossed_out &&
                                ballNumbers.includes(cell.number) &&
                                cell.number !== "0"
                            ) {
                                return { ...cell, crossed_out: true };
                            }
                            if (!cell.crossed_out && cell.number !== "0") {
                                tombola = false;
                            }
                            return cell;
                        })
                    );
                    return updatedCard;
                });

                // If all relevant numbers are crossed out, show the tombola popup
                if (tombola) {
                    setVisible(true);
                }

                // Update the Bingo Cards data without revalidating
                mutateBingoCards(updatedCards, false)
                    .then(() => {
                        console.log("Bingo Cards data updated successfully.");
                    })
                    .catch((error) => {
                        console.error("Error updating Bingo Cards data:", error);
                    });
            }
        },
        [bingoCardsData, bingoBallsData, mutateBingoCards]
    );

    /**
     * Effect to update Bingo Cards whenever Bingo Balls data changes.
     * Ensures that the cards are updated based on the latest drawn numbers.
     */
    useEffect(() => {
        if (bingoBallsData && playerId) {
            const ballNumbers = bingoBallsData.map((ball) => ball.number.toString());
            updateCardData(ballNumbers);
        }
    }, [bingoBallsData, updateCardData, playerId]);

    /**
     * Effect to set up an interval for fetching new Bingo Balls every 20 seconds.
     * Ensures that the latest balls are fetched periodically.
     */
    useEffect(() => {
        const intervalId = setInterval(() => {
            mutateBingoBalls()
                .then(() => {
                    console.log("Bingo Balls data revalidated successfully.");
                })
                .catch((error) => {
                    console.error("Error revalidating Bingo Balls data:", error);
                });
        }, 20000); // 20 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [mutateBingoBalls]);

    /**
     * Handler for the search form submission.
     * Validates the search term and triggers data loading.
     * @param event - Form event.
     */
    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchTerm.trim() !== "" && searchTerm.trim().length === 6) {
            loadData();
        }
    };

    /**
     * Handler for changes in the search input field.
     * Updates the searchTerm state as the user types.
     * @param event - Change event.
     */
    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    };

    /**
     * Render Bingo Cards if data is available.
     * Maps each card to the BingoCard component.
     */
    const bingoCards = bingoCardsData?.map((card) => (
        <BingoCard
            key={card.card_id} // Unique identifier for each card
            card={card}
            visible={visible}
            onClose={() => setVisible(false)}
        />
    ));

    /**
     * Render error message if there's an error in fetching data.
     * Provides a Retry button to attempt fetching again.
     */
    if (bingoCardsError || bingoBallsError) {
        return (
            <div className="container mx-auto p-4">
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex flex-col sm:flex-row items-center mb-4"
                >
                    <input
                        className="border border-gray-300 text-black rounded py-2 px-4 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Enter your ID (6 characters)..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        maxLength={6}
                    />
                    <button
                        className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                        type="submit"
                        disabled={searchTerm.trim().length !== 6}
                    >
                        Search
                    </button>
                </form>
                <p className="text-red-500">
                    There was an error loading the cards.
                    {bingoCardsError && <span> {String(bingoCardsError)}</span>}
                </p>
                <button
                    onClick={loadData}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                    Retry
                </button>
            </div>
        );
    }

    /**
     * Render a loading spinner while data is being fetched.
     * Enhances user experience by indicating ongoing processes.
     */
    if (bingoCardsLoading || bingoBallsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
        );
    }

    /**
     * Main render of the component.
     * Displays the search form, bingo cards, and footer with social icons.
     */
    return (
        <div className="container mx-auto p-4">
            <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-center mb-4 justify-center"
            >
                <input
                    className="border border-gray-300 text-black rounded py-2 px-4 focus:outline-blue-500 focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter your ID (6 characters)..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    maxLength={6}
                />
                <button
                    className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
                    type="submit"
                    disabled={searchTerm.trim().length !== 6}
                >
                    Search
                </button>
            </form>

            <div className="flex flex-wrap justify-center">
                {bingoCards && bingoCards.length > 0 ? (
                    bingoCards
                ) : (
                    playerId && <p className="text-gray-600">No cards found.</p> // Only show message if playerId is set
                )}
            </div>

        </div>
    );
};

export default BingoCardsList;
