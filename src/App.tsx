import './styles/components/game.css';

function App() {
    return (
        <>
            <div className="game">
                <div className="game__header">
                    <svg className="game__logo" viewBox="0 0 72 32" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path
                                d="M8.562 1.634 16 9.073l7.438-7.439a3 3 0 0 1 4.243 0l2.685 2.685a3 3 0 0 1 0 4.243L22.927 16l7.439 7.438a3 3 0 0 1 0 4.243l-2.685 2.685a3 3 0 0 1-4.243 0L16 22.927l-7.438 7.439a3 3 0 0 1-4.243 0L1.634 27.68a3 3 0 0 1 0-4.243L9.073 16 1.634 8.562a3 3 0 0 1 0-4.243L4.32 1.634a3 3 0 0 1 4.243 0Z"
                                fill="#31C3BD"/>
                            <path
                                d="M56.1 0c8.765 0 15.87 7.106 15.87 15.87 0 8.766-7.105 15.871-15.87 15.871-8.765 0-15.87-7.105-15.87-15.87C40.23 7.106 47.334 0 56.1 0Zm0 9.405a6.466 6.466 0 1 0 0 12.931 6.466 6.466 0 0 0 0-12.931Z"
                                fill="#F2B137" fill-rule="nonzero"/>
                        </g>
                    </svg>
                    <div className="game__turn-indicator">
                        <svg id="icon-x-default" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"/>
                        </svg>
                        <svg id="icon-o-default" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
                                  fill-rule="evenodd"/>
                        </svg>
                        <p>Turn</p>
                    </div>
                    <button className="game__restart">
                        <svg id="icon-restart" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.524 0h-1.88a.476.476 0 0 0-.476.499l.159 3.284A9.81 9.81 0 0 0 9.835.317C4.415.317-.004 4.743 0 10.167.004 15.597 4.406 20 9.835 20a9.796 9.796 0 0 0 6.59-2.536.476.476 0 0 0 .019-.692l-1.348-1.349a.476.476 0 0 0-.65-.022 6.976 6.976 0 0 1-9.85-.63 6.987 6.987 0 0 1 .63-9.857 6.976 6.976 0 0 1 10.403 1.348l-4.027-.193a.476.476 0 0 0-.498.476v1.881c0 .263.213.476.476.476h7.944A.476.476 0 0 0 20 8.426V.476A.476.476 0 0 0 19.524 0Z"
                                  fill="evenodd"/>
                        </svg>
                    </button>
                </div>
                <div className="game__board">
                    {/* TODO: Square.tsx */}
                    <button className="game__square">1</button>
                    <button className="game__square">2</button>
                    <button className="game__square">3</button>
                    <button className="game__square">4</button>
                    <button className="game__square">5</button>
                    <button className="game__square">6</button>
                    <button className="game__square">7</button>
                    <button className="game__square">8</button>
                    <button className="game__square">9</button>
                </div>
                <div className="game__results">
                    <div className="results-wrapper">
                        <p>Player</p>
                        <p>Anzahl</p>
                    </div>
                    <div className="results-wrapper">
                        <p>Player</p>
                        <p>Anzahl</p>
                    </div>
                    <div className="results-wrapper">
                        <p>Player</p>
                        <p>Anzahl</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App;