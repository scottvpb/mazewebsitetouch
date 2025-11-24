// Complete Room Data for Maze
// To extract coordinates from the original HTML files:
// 1. Open each room*.html file in your local mazewebsite folder
// 2. Find the <map> tag with image map coordinates
// 3. Look for <area shape="rect" coords="x1,y1,x2,y2" href="roomN.html">
// 4. Copy those coordinates to the clickableAreas below

const roomData = {
    1: {
        title: "the entrance hall of the Maze",
        text: `They looked carefully at the bronze doors, trying to choose. The uncertainty of visitors is one of my little pleasures.

"It's easy to get lost," I said helpfully. "This can be a sinister place." The sun glared at me through the gateway.

Something was ringing behind one of the doors. They spent some time trying to decide which door it was, not understanding that the silences of the Maze are as eloquent as the sounds.

"Decisions, decisions," one said. "Too many decisions."

"The story of my life," said another.

"We don't want to be late," said a third, opening one of the doors.

"Nary a soul to be seen," said the first, peering into the gloom.

I waited patiently for them to choose which way to go . . .

into . . .`,
        image: './images/room1.jpg',
        doors: [20, 26, 41, 21],
        clickableAreas: [
            // Extract these from room1.html <area> tags
            // Example format: { door: 20, coords: [x1, y1, x2, y2] }
            { door: 20, coords: [150, 100, 270, 300] },
            { door: 26, coords: [530, 100, 650, 300] },
            { door: 41, coords: [300, 350, 500, 500] },
            { door: 21, coords: [100, 400, 250, 550] }
        ]
    },
    
    2: {
        title: "Room 2",
        text: `[Extract text from room2.html]`,
        image: './images/room2.jpg',
        doors: [], // Add door numbers from the HTML
        clickableAreas: [
            // Extract from room2.html
        ]
    },
    
    3: {
        title: "Room 3",
        text: `[Extract text from room3.html]`,
        image: './images/room3.jpg',
        doors: [],
        clickableAreas: []
    },
    
    4: {
        title: "Room 4",
        text: `[Extract text from room4.html]`,
        image: './images/room4.jpg',
        doors: [],
        clickableAreas: []
    },
    
    5: {
        title: "Room 5",
        text: `[Extract text from room5.html]`,
        image: './images/room5.jpg',
        doors: [],
        clickableAreas: []
    },
    
    6: {
        title: "Room 6",
        text: `[Extract text from room6.html]`,
        image: './images/room6.jpg',
        doors: [],
        clickableAreas: []
    },
    
    7: {
        title: "Room 7",
        text: `[Extract text from room7.html]`,
        image: './images/room7.jpg',
        doors: [],
        clickableAreas: []
    },
    
    8: {
        title: "Room 8",
        text: `[Extract text from room8.html]`,
        image: './images/room8.jpg',
        doors: [],
        clickableAreas: []
    },
    
    9: {
        title: "Room 9",
        text: `[Extract text from room9.html]`,
        image: './images/room9.jpg',
        doors: [],
        clickableAreas: []
    },
    
    10: {
        title: "Room 10",
        text: `[Extract text from room10.html]`,
        image: './images/room10.jpg',
        doors: [],
        clickableAreas: []
    },
    
    // Continue for rooms 11-45...
    // Copy this template for each remaining room
    
    45: {
        title: "Room 45",
        text: `[Extract text from room45.html]`,
        image: './images/room45.jpg',
        doors: [],
        clickableAreas: []
    }
};

/* 
INSTRUCTIONS FOR EXTRACTING DATA FROM YOUR LOCAL REPO:

1. Open mazewebsite/room1.html in a text editor
2. Find the <map> tag - it will look like:
   <map name="roommap">
     <area shape="rect" coords="150,100,270,300" href="room20.html">
     <area shape="rect" coords="530,100,650,300" href="room26.html">
     ...
   </map>

3. For each <area> tag:
   - The "coords" are your clickableAreas coordinates [x1,y1,x2,y2]
   - The "href" tells you which room that door leads to
   - Add to clickableAreas as: { door: 20, coords: [150, 100, 270, 300] }

4. The text content appears before the <img> tag
5. The doors array is all the room numbers that this room connects to

6. Repeat for all 45 rooms

QUICK EXTRACTION SCRIPT:
You can use this Python script to help extract the data:

```python
import re
import glob

for filename in sorted(glob.glob('mazewebsite/room*.html')):
    with open(filename, 'r') as f:
        content = f.read()
        
        # Extract room number
        room_num = re.search(r'room(\d+)\.html', filename).group(1)
        
        # Extract all area coords and linked rooms
        areas = re.findall(r'<area[^>]*coords="([^"]*)"[^>]*href="room(\d+)\.html"', content)
        
        print(f"Room {room_num}:")
        print(f"  doors: [{', '.join([door for coords, door in areas])}],")
        print(f"  clickableAreas: [")
        for coords, door in areas:
            print(f"    {{ door: {door}, coords: [{coords.replace(',', ', ')}] }},")
        print(f"  ]")
        print()
```

*/