// Maze Viewer Application
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

const FileText = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

const Pencil = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

const Download = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const Upload = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const Trash = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const MazeViewer = () => {
    const [showModal, setShowModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showLoadDialog, setShowLoadDialog] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragThreshold, setDragThreshold] = useState(false);
    const [lastTap, setLastTap] = useState(0);
    const [currentRoom, setCurrentRoom] = useState(1);
    const [imageError, setImageError] = useState(false);
    
    // Notes state
    const [notes, setNotes] = useState('');
    const [notesMode, setNotesMode] = useState('text'); // 'text' or 'draw'
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#000000');
    const [drawWidth, setDrawWidth] = useState(2);
    
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // Sample room data - expand this for all 45 rooms
    const roomData = {
        1: {
            text: `They looked carefully at the bronze doors, trying to choose. The uncertainty of visitors is one of my little pleasures.

"It's easy to get lost," I said helpfully. "This can be a sinister place." The sun glared at me through the gateway.

Something was ringing behind one of the doors. They spent some time trying to decide which door it was, not understanding that the silences of the Maze are as eloquent as the sounds.

    const roomData = {
        1: {
            text: `They looked carefully at the bronze doors, trying to choose. The uncertainty of visitors is one of my little pleasures.
                // Try to show custom dialog (may not work in all browsers)
                setTimeout(() => {
                    if (confirm('Would you like to download a copy of your notes before leaving?')) {
                        downloadNotes();
                    }
                }, 100);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [notes]);

    const getEmptyCanvasDataURL = () => {
            image: './images/room1.jpg',
            doors: [20, 26, 41, 21],
            clickableAreas: [
                { door: 20, coords: [119, 53, 219, 241] },
                { door: 26, coords: [238, 52, 337, 238] },
                { door: 41, coords: [350, 45, 400, 264] },
                { door: 21, coords: [415, 35, 472, 303] }
            ]
        },
        2: {
            text: `...a bright room whose walls were in some disrepair. The floorboards creaked and groaned; the plaster made a gritty sound. They studied the old frescoes for clues but missed the obvious signs.
        const canvas = document.createElement('canvas');
        canvas.width = 800;
            image: './images/room2.jpg',
            doors: [22, 29, 12],
            clickableAreas: [
                { door: 22, coords: [187, 69, 314, 244] },
                { door: 29, coords: [48, 52, 112, 273] },
                { door: 12, coords: [387, 44, 450, 317] }
            ]
        },
        3: {
            text: `. . . an entirely different kind of place.
        canvas.height = 600;
        return canvas.toDataURL();
    };
            image: './images/room3.jpg',
            doors: [33, 9, 18],
            clickableAreas: [
                { door: 33, coords: [23, 23, 76, 345] },
                { door: 9, coords: [254, 35, 339, 228] },
                { door: 18, coords: [392, 18, 448, 314] }
            ]
        },
        4: {
            text: `. . . the great hall of many doors.

    // Download notes as JSON file
    const downloadNotes = () => {
        const notesData = {
            textNotes: notes,
            image: './images/room4.jpg',
            doors: [44, 29, 15, 11, 16, 24, 43],
            clickableAreas: [
                { door: 44, coords: [37, 24, 115, 363] },
                { door: 29, coords: [135, 63, 172, 285] },
                { door: 15, coords: [177, 78, 198, 254] },
                { door: 11, coords: [226, 91, 269, 224] },
                { door: 16, coords: [297, 76, 319, 259] },
                { door: 24, coords: [327, 61, 361, 290] },
                { door: 43, coords: [384, 27, 456, 359] }
            ]
        },
        5: {
            text: `. . . the tree room.
            drawing: canvasRef.current ? canvasRef.current.toDataURL() : null,
            currentRoom: currentRoom,
            timestamp: new Date().toISOString()
        };
            image: './images/room5.jpg',
            doors: [43, 22, 30, 20],
            clickableAreas: [
                { door: 43, coords: [41, 77, 102, 244] },
                { door: 22, coords: [154, 75, 213, 244] },
                { door: 30, coords: [270, 78, 331, 240] },
                { door: 20, coords: [378, 86, 446, 243] }
            ]
        }
    };
        
        const blob = new Blob([JSON.stringify(notesData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `maze-notes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Load notes from file
    const loadNotesFromFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.textNotes) setNotes(data.textNotes);
                if (data.currentRoom) setCurrentRoom(data.currentRoom);
                if (data.drawing && canvasRef.current) {
                    const img = new Image();
                    img.onload = () => {
                        const ctx = canvasRef.current.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        saveDrawing();
                    };
                    img.src = data.drawing;
                }
                setShowLoadDialog(false);
                alert('Notes loaded successfully!');
            } catch (err) {
                alert('Error loading notes file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };

    // Clear all notes and drawings
    const clearAllNotes = () => {
        if (confirm('Are you sure you want to clear all notes and drawings? This cannot be undone.')) {
            setNotes('');
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                saveDrawing();
            }
            localStorage.removeItem('mazeNotes');
            localStorage.removeItem('mazeDrawing');
        }
    };

    // Canvas drawing functions
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = 800;
        canvas.height = 600;
        
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, [showNotesModal]);

    const startDrawing = (e) => {
        if (notesMode !== 'draw') return;
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing || notesMode !== 'draw') return;
        e.preventDefault();
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveDrawing();
        }
    };

    const clearCanvas = () => {
        if (confirm('Clear the drawing canvas?')) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            saveDrawing();
        }
    };

    // Handle mouse/touch start
    const handlePointerDown = (e) => {
        if (e.target.tagName === 'IMG' || e.target === containerRef.current) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setDragStart({
                x: clientX - position.x,
                y: clientY - position.y
            });
            setDragThreshold(false);
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
        
        if (!dragThreshold) {
            const distance = Math.hypot(newX - position.x, newY - position.y);
            if (distance > 5) {
                setDragThreshold(true);
                e.preventDefault();
            }
        }
        
        if (dragThreshold) {
            e.preventDefault();
            setPosition({ x: newX, y: newY });
        }
    };

    // Handle mouse/touch end
    const handlePointerUp = () => {
        setIsDragging(false);
        setDragThreshold(false);
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
        if (dragThreshold) return;
        
        if (!imageRef.current || imageError) return;
        
        if (e.type === 'touchend' || e.nativeEvent?.pointerType === 'touch') {
            const now = Date.now();
            const timeSinceLastTap = now - lastTap;
            
            if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
                handleRoomNavigation(e);
                setLastTap(0);
            } else {
                setLastTap(now);
            }
        } else {
            handleRoomNavigation(e);
        }
    };
    
    const handleRoomNavigation = (e) => {
        const rect = imageRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
        const clientY = e.touches ? e.touches[0].clientY : (e.changedTouches ? e.changedTouches[0].clientY : e.clientY);
        
        const x = (clientX - rect.left) / (rect.width / imageRef.current.naturalWidth);
        const y = (clientY - rect.top) / (rect.height / imageRef.current.naturalHeight);
        
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
            <rect width="800" height="600" fill="#2d1810"/>
            <rect x="50" y="50" width="700" height="500" fill="#3d2820" stroke="#8b6f47" strokeWidth="4"/>
            <rect x="150" y="100" width="120" height="200" fill="#1a0f0a" stroke="#8b6f47" strokeWidth="3"/>
            <rect x="530" y="100" width="120" height="200" fill="#1a0f0a" stroke="#8b6f47" strokeWidth="3"/>
            <rect x="300" y="350" width="200" height="150" fill="#1a0f0a" stroke="#8b6f47" strokeWidth="3"/>
            <text x="210" y="210" fill="#d4af37" fontSize="48" fontFamily="serif" textAnchor="middle">20</text>
            <text x="590" y="210" fill="#d4af37" fontSize="48" fontFamily="serif" textAnchor="middle">26</text>
            <text x="400" y="435" fill="#d4af37" fontSize="48" fontFamily="serif" textAnchor="middle">41</text>
            <text x="400" y="50" fill="#d4af37" fontSize="32" fontFamily="serif" textAnchor="middle" fontWeight="bold">
                Room {currentRoom}
            </text>
            <text x="400" y="570" fill="#8b6f47" fontSize="16" fontFamily="sans-serif" textAnchor="middle">
                Check image path: ./images/room{currentRoom}.jpg
            </text>
        </svg>
    );

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
                            onTouchEnd={handleImageClick}
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

            {/* Notes Button */}
            <button
                onClick={() => setShowNotesModal(true)}
                className="fixed top-20 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
                aria-label="Open notes"
            >
                <FileText size={24} />
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
            <div className="fixed top-20 left-4 flex flex-col gap-2 z-50">
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
                    Doors: {room.doors.join(', ')}
                </div>
            </div>

            {/* Room Description Modal */}
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
                                Room {currentRoom}
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
                        </div>
                    </div>
                </div>
            )}

            {/* Notes Modal */}
            {showNotesModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowNotesModal(false)}
                >
                    <div
                        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Notes Header */}
                        <div className="bg-blue-100 border-b-2 border-blue-300 p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-serif text-blue-900">
                                Maze Notes
                            </h2>
                            <button
                                onClick={() => setShowNotesModal(false)}
                                className="text-blue-900 hover:text-blue-700 transition-colors"
                                aria-label="Close notes"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Mode Selector */}
                        <div className="bg-gray-100 p-3 flex gap-2 border-b">
                            <button
                                onClick={() => setNotesMode('text')}
                                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                                    notesMode === 'text' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <FileText size={18} />
                                Text Notes
                            </button>
                            <button
                                onClick={() => setNotesMode('draw')}
                                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                                    notesMode === 'draw' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Pencil size={18} />
                                Drawing
                            </button>
                        </div>

                        {/* Notes Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {notesMode === 'text' ? (
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Type your notes here... They will be saved automatically."
                                    className="w-full h-full min-h-[400px] p-4 border-2 border-gray-300 rounded resize-none focus:outline-none focus:border-blue-500"
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    {/* Drawing Controls */}
                                    <div className="w-full mb-3 flex gap-3 items-center bg-gray-100 p-3 rounded">
                                        <label className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">Color:</span>
                                            <input
                                                type="color"
                                                value={drawColor}
                                                onChange={(e) => setDrawColor(e.target.value)}
                                                className="w-10 h-10 rounded cursor-pointer"
                                            />
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">Width:</span>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                value={drawWidth}
                                                onChange={(e) => setDrawWidth(parseInt(e.target.value))}
                                                className="w-32"
                                            />
                                            <span className="text-sm w-8">{drawWidth}px</span>
                                        </label>
                                        <button
                                            onClick={clearCanvas}
                                            className="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                                        >
                                            <Trash size={18} />
                                            Clear Canvas
                                        </button>
                                    </div>
                                    
                                    {/* Drawing Canvas */}
                                    <canvas
                                        ref={canvasRef}
                                        className="border-2 border-gray-300 rounded cursor-crosshair bg-white"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={startDrawing}
                                        onTouchMove={draw}
                                        onTouchEnd={stopDrawing}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Notes Footer */}
                        <div className="bg-gray-100 p-4 border-t flex gap-2 flex-wrap">
                            <button
                                onClick={downloadNotes}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                            >
                                <Download size={18} />
                                Download Notes
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                            >
                                <Upload size={18} />
                                Load Notes
                            </button>
                            <button
                                onClick={clearAllNotes}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors ml-auto"
                            >
                                <Trash size={18} />
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Modal */}
            {showWelcomeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
                    <div className="bg-amber-50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="bg-amber-900 text-amber-50 p-6">
                            <h1 className="text-3xl font-serif font-bold mb-2">
                                MAZE
                            </h1>
                            <p className="text-xl font-serif italic">
                                Solve the World's Most Challenging Puzzle
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="bg-amber-100 border-2 border-amber-300 p-4 rounded">
                                <p className="text-gray-800 leading-relaxed">
                                    This website is a web version of Christopher Manson's 1985 book, <em>Maze: Solve the World's Most Challenging Puzzle</em>.
                                </p>
                            </div>
                            
                            <div className="border-l-4 border-amber-600 pl-4 my-6">
                                <p className="text-gray-700 leading-relaxed italic">
                                    I invite you to enter my Maze. I say it is mine, because despite who else I might be, I am the architect as well as your guide. Your first goal is to find the shortest route through the Maze—a simple task, I assure you, if you know what to look for.
                                </p>
                                <p className="text-gray-700 leading-relaxed italic mt-3">
                                    I have planted clues throughout for your interpretation—or misinterpretation. Indeed, you will be fascinated by the Maze's ambiguity, stimulated by its mystery, stymied by its riddle. But fear not! I will be with you all the way. Fear not, that is, if you truly believe that my clues or I can be trusted.
                                </p>
                            </div>
                            
                            <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
                                <h3 className="font-semibold text-blue-900 mb-2">Modern Features:</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    <li>Touch-optimized controls for mobile devices</li>
                                    <li>Pan and zoom to explore every detail</li>
                                    <li>Built-in notes system with drawing canvas</li>
                                    <li>Your progress and notes are automatically saved</li>
                                </ul>
                            </div>
                            
                            <div className="bg-gray-100 p-4 rounded text-sm text-gray-600">
                                <p className="mb-2">
                                    <strong>Controls:</strong>
                                </p>
                                <p className="mb-1">
                                    <strong>Desktop:</strong> Click doors to navigate • Drag to pan • Scroll to zoom
                                </p>
                                <p>
                                    <strong>Touch:</strong> Double-tap doors • Drag to pan • Pinch to zoom
                                </p>
                            </div>
                            
                            <div className="text-xs text-gray-500 border-t pt-4 mt-4">
                                <p className="mb-2">
                                    Created by Al Sweigart • <a href="https://inventwithpython.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">inventwithpython.com</a>
                                </p>
                                <p>
                                    This unofficial website is not affiliated with Christopher Manson or Henry Holt and Company.
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-amber-100 p-4 flex gap-3 border-t-2 border-amber-300">
                            <button
                                onClick={() => {
                                    setShowWelcomeModal(false);
                                    setShowLoadDialog(true);
                                }}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded transition-colors font-semibold"
                            >
                                Load Existing Notes
                            </button>
                            <button
                                onClick={() => setShowWelcomeModal(false)}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded transition-colors font-semibold"
                            >
                                Enter the Maze
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Dialog on First Visit */}
            {showLoadDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
                        <h2 className="text-2xl font-serif text-gray-900 mb-4">
                            Welcome to the Maze!
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Would you like to load existing notes from a previous session?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded transition-colors font-semibold"
                            >
                                Load Existing Notes
                            </button>
                            <button
                                onClick={() => setShowLoadDialog(false)}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded transition-colors font-semibold"
                            >
                                Start Fresh
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={loadNotesFromFile}
                className="hidden"
            />

            {/* Instructions overlay */}
            <div className="fixed top-36 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-90 text-white px-6 py-3 rounded-lg text-sm text-center pointer-events-none z-40 max-w-md">
                <div className="font-semibold mb-1">Controls</div>
                <div className="text-xs opacity-90">
                    Desktop: Click doors • Drag to pan • Scroll to zoom<br/>
                    Touch: Double-tap doors • Drag to pan • Pinch to zoom
                </div>
                {imageError && (
                    <div className="text-xs text-amber-400 mt-2">
                        Image not found - check the path in the code
                    </div>
                )}
            </div>
        </div>
    );
};

// Render the app
ReactDOM.render(<MazeViewer />, document.getElementById('root'));