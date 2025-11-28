const { useState, useRef, useEffect } = React;

// Lucide icons as inline SVG components
const Info = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const X = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Home = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const ZoomIn = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
);

const ZoomOut = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
);

const List = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

const MazeViewer = () => {
    const [showModal, setShowModal] = useState(false);
    const [showRoomList, setShowRoomList] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
    const [currentRoom, setCurrentRoom] = useState(0);
    const [imageError, setImageError] = useState(false);

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Use roomData from window (loaded from roomData.js)
    const roomData = window.roomData || {};
    const room = roomData[currentRoom];

    // Get sorted list of all room numbers
    const allRooms = Object.keys(roomData).map(Number).sort((a, b) => a - b);

    // Handle mouse/touch start
    const handlePointerDown = (e) => {
        if (e.target.tagName === 'IMG' || e.target === containerRef.current) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setDragStart({
                x: clientX - position.x,
                y: clientY - position.y
            });
            setDragStartPos({ x: clientX, y: clientY });
            setIsDragging(true);
        }
    };

    // Handle mouse/touch move
    const handlePointerMove = (e) => {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        e.preventDefault();
        setPosition({ x: newX, y: newY });
    };

    // Handle mouse/touch end
    const handlePointerUp = () => {
        setIsDragging(false);
    };

    // Handle pinch zoom on touch devices
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            containerRef.current.dataset.initialPinchDistance = distance;
            containerRef.current.dataset.initialScale = scale;
        } else {
            handlePointerDown(e);
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            const initialDistance = parseFloat(containerRef.current.dataset.initialPinchDistance);
            const initialScale = parseFloat(containerRef.current.dataset.initialScale);

            if (initialDistance) {
                const newScale = initialScale * (distance / initialDistance);
                setScale(Math.min(Math.max(0.5, newScale), 4));
            }
        } else {
            handlePointerMove(e);
        }
    };

    // Handle mouse wheel zoom
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.5, scale + delta), 4);
        setScale(newScale);
    };

    // Reset view
    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Zoom in/out buttons
    const zoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 4));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [scale]);

    // Reset position when changing rooms
    useEffect(() => {
        resetView();
        setImageError(false);
    }, [currentRoom]);

    // Handle image click to navigate to rooms
    const handleImageClick = (e) => {
        if (!imageRef.current || imageError) return;

        // Check if this was actually a drag vs a click
        const clientX = e.clientX;
        const clientY = e.clientY;
        const distance = Math.hypot(
            clientX - dragStartPos.x,
            clientY - dragStartPos.y
        );

        // If moved more than 10 pixels, it was a drag, not a click
        if (distance > 10) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (rect.width / imageRef.current.naturalWidth);
        const y = (e.clientY - rect.top) / (rect.height / imageRef.current.naturalHeight);

        // Check if click is within any clickable area
        const clickedArea = room.clickableAreas?.find(area => {
            const [ax, ay, ax2, ay2] = area.coords;
            return x >= ax && x <= ax2 && y >= ay && y <= ay2;
        });

        if (clickedArea) {
            setCurrentRoom(clickedArea.door);
        }
    };

    const PlaceholderImage = () => (
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" className="select-none">
            <rect width="800" height="600" fill="#2d1810" />
            <rect x="50" y="50" width="700" height="500" fill="#3d2820" stroke="#8b6f47" strokeWidth="4" />

            {room.doors?.map((door, idx) => {
                const positions = [
                    { x: 150, y: 100, w: 120, h: 200 },
                    { x: 530, y: 100, w: 120, h: 200 },
                    { x: 300, y: 350, w: 200, h: 150 },
                    { x: 100, y: 400, w: 150, h: 150 }
                ];
                const pos = positions[idx] || positions[0];
                return (
                    <g key={door}>
                        <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} fill="#1a0f0a" stroke="#8b6f47" strokeWidth="3" />
                        <text x={pos.x + pos.w / 2} y={pos.y + pos.h / 2} fill="#d4af37" fontSize="48" fontFamily="serif" textAnchor="middle" dominantBaseline="middle">{door}</text>
                    </g>
                );
            })}

            <text x="400" y="50" fill="#d4af37" fontSize="32" fontFamily="serif" textAnchor="middle" fontWeight="bold">
                Room {currentRoom}
            </text>

            <text x="400" y="570" fill="#8b6f47" fontSize="16" fontFamily="sans-serif" textAnchor="middle">
                Check image path: {room?.image || './images/room' + currentRoom + '.jpg'}
            </text>
        </svg>
    );

    // If no room data, show loading message
    if (!room) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-2xl mb-4">Loading Maze...</h1>
                    <p>Room data not found. Make sure roomData.js is loaded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 overflow-hidden">
            {/* Image Container */}
            <div
                ref={containerRef}
                className="w-full h-full cursor-move touch-none"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handlePointerUp}
            >
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {imageError ? (
                        <PlaceholderImage />
                    ) : (
                        <img
                            ref={imageRef}
                            src={room.image}
                            alt={`Room ${currentRoom}`}
                            className="max-w-full max-h-full object-contain select-none cursor-pointer"
                            draggable="false"
                            onError={() => setImageError(true)}
                            onClick={handleImageClick}
                            style={{ pointerEvents: 'auto' }}
                        />
                    )}
                </div>
            </div>

            {/* Info Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed top-4 right-4 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
                aria-label="Show room description"
            >
                <Info size={24} />
            </button>

            {/* Room List Button */}
            <button
                onClick={() => setShowRoomList(true)}
                className="fixed top-4 right-20 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
                aria-label="Show all rooms"
            >
                <List size={24} />
            </button>

            {/* Home/Reset Button */}
            <button
                onClick={resetView}
                className="fixed top-4 left-4 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-colors z-50"
                aria-label="Reset view"
            >
                <Home size={24} />
            </button>

            {/* Zoom Controls */}
            <div className="fixed top-20 right-4 flex flex-col gap-2 z-50">
                <button
                    onClick={zoomIn}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-colors"
                    aria-label="Zoom in"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={zoomOut}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg transition-colors"
                    aria-label="Zoom out"
                >
                    <ZoomOut size={20} />
                </button>
            </div>

            {/* Zoom Indicator */}
            <div className="fixed bottom-4 left-4 bg-gray-800 bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm z-50">
                Zoom: {Math.round(scale * 100)}%
            </div>

            {/* Room Navigation */}
            <div className="fixed bottom-4 right-4 bg-gray-800 bg-opacity-80 text-white px-4 py-2 rounded-lg z-50">
                <div className="text-xs mb-1 opacity-70">Room {currentRoom}</div>
                <div className="text-xs opacity-70">
                    Doors: {room.doors?.join(', ') || 'None'}
                </div>
            </div>

            {/* Description Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-amber-50 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-amber-100 border-b-2 border-amber-300 p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-amber-900">
                                {room.title || `Room ${currentRoom}`}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-amber-900 hover:text-amber-700 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-line font-serif text-lg">
                                {room.text}
                            </div>
                            {room.doors && room.doors.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-amber-300">
                                    <div className="text-sm text-amber-900 font-semibold mb-2">
                                        Available Doors:
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {room.doors.map(door => (
                                            <button
                                                key={door}
                                                onClick={() => {
                                                    setCurrentRoom(door);
                                                    setShowModal(false);
                                                }}
                                                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition-colors font-semibold"
                                            >
                                                Room {door}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Room List Modal */}
            {showRoomList && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowRoomList(false)}
                >
                    <div
                        className="bg-purple-50 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-purple-100 border-b-2 border-purple-300 p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-purple-900">
                                All Rooms
                            </h2>
                            <button
                                onClick={() => setShowRoomList(false)}
                                className="text-purple-900 hover:text-purple-700 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                                {allRooms.map(roomNum => (
                                    <button
                                        key={roomNum}
                                        onClick={() => {
                                            setCurrentRoom(roomNum);
                                            setShowRoomList(false);
                                        }}
                                        className={`
                                            px-3 py-2 rounded font-semibold transition-colors
                                            ${roomNum === currentRoom
                                                ? 'bg-purple-700 text-white'
                                                : 'bg-purple-600 hover:bg-purple-700 text-white'}
                                        `}
                                    >
                                        {roomNum}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-600">
                                Total rooms: {allRooms.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions overlay - now clickable to dismiss */}
            {showControls && (
                <div
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 text-white px-6 py-3 rounded-lg text-sm text-center cursor-pointer z-40 max-w-md hover:bg-opacity-100 transition-all"
                    onClick={() => setShowControls(false)}
                >
                    <div className="font-semibold mb-1">Controls (click to dismiss)</div>
                    <div className="text-xs opacity-90">
                        Click doors to navigate • Drag to pan • Scroll/Pinch to zoom
                    </div>
                    <div className="text-xs opacity-90 mt-1">
                        Info button for story • List button for all rooms
                    </div>
                    {imageError && (
                        <div className="text-xs text-amber-400 mt-2">
                            Image not found - check the path in the code
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

ReactDOM.render(<MazeViewer />, document.getElementById('root'));