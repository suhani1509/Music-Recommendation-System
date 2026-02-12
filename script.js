// HTML elements ko select karna
const searchBtn = document.getElementById('search-btn');
const songInput = document.getElementById('song-input');
const tableBody = document.getElementById('table-body');

// Jab button click ho, tab ye function chale
searchBtn.addEventListener('click', async () => {
    const songName = songInput.value;

    if (!songName) {
        alert("Please enter a song name!");
        return;
    }

    // Table ko clear karna aur loading dikhana
    tableBody.innerHTML = "<tr><td colspan='2'>Searching for recommendations...</td></tr>";

    try {
        // FastAPI server ko request bhejna
        // Note: Hamara FastAPI server localhost:8000 par chalega
        const response = await fetch(`http://127.0.0.1:8000/recommend?song=${encodeURIComponent(songName)}`);
        
        
        if (!response.ok) {
            throw new Error("Song not found or Server error");
        }

        const data = await response.json();

        // Table khali karke results bharna
        tableBody.innerHTML = "";

        if (data.recommendations.length > 0) {
            data.recommendations.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.artist}</td>
                        <td>${item.song}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='2'>No matches found. Try another song!</td></tr>";
        }

    } catch (error) {
        console.error("Error:", error);
        tableBody.innerHTML = "<tr><td colspan='2' style='color:red;'>Error: Could not connect to the backend.</td></tr>";
    }
});