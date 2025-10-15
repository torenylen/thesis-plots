document.getElementById('csvFile').addEventListener('change', handleFileSelect);

let PLOTLY_COLORMAP = [
    "127a3e",
    "9c2219",
    "12498c",
    "e6ba39",
    "151829",
    "252c45",
    "3c4b6b",
    "596e8f",
    "7293a6",
    "95bac2",
    "0b2566",
    "1c7199",
    "319fb0",
    "86d9d5",
    "0d323b",
    "114d44",
    "5ab03f",
    "b5d96c",
    "590c25",
    "bd622a",
    "eddc6b",
    "300633",
    "61135a",
    "8f2b76",
    "b04d8a",
    "d17997",
    "e0a2ad",
    "732816",
    "964a2c",
    "ba7947",
    "d9b484",
    "fffece"
]


let data = [];
var CURRENT_SONG_INDEX = -1

function handleFileSelect(e) {
    // this thing was mostly ai generated through vibe coding so probably won't work lol
    const file = e.target.files[0];
    const reader = new FileReader();
    console.log("found file!")
    let textDiv = document.getElementById('textDiv');
    textDiv.innerText = "Loading..."


    reader.onload = function (e) {
        const csvData = e.target.result;
        const parsed = Papa.parse(csvData, { header: true });
        data = parsed.data.map(d => ({
            id: d.identifier,
            x: parseFloat(d.x),
            y: parseFloat(d.y),
            mp3: d.mp3_path,
            close1: d.close1,
            close2: d.close2,
            color: parseInt(d.color),
        }));

        console.log(data)
        doPlotly2d()
    };

    reader.readAsText(file);
}

function doPlotly2d() {

    // https://lospec.com/palette-list/overworld-32

    // data.map(d => {
    //             console.log("colors: #" + colormap[d.color % 32]);
    //             return "#" + colormap[d.color % 32];
    //         })

    // https://plotly.com/javascript/line-and-scatter/
    let trace1 = {
        x: data.map(d => (d.x)),
        y: data.map(d => (d.y)),
        text: data.map(d => (d.id)),
        mode: 'markers',
        type: 'scattergl',
        name: 'data',
        marker: {
            size: 3,
            color: data.map(d => {
                return "#" + PLOTLY_COLORMAP[d.color % 32] + "30";
            }),
        }

    };

    let plotlyData = [trace1];

    let layout = {
        autosize: false,
        width: 900,
        height: 700,
        // showlegend: true,
        xaxis: {
            range: [-6.5, 6.5]
        },
        yaxis: {
            range: [-6.5, 6.5]
        },
        title: { text: 'AI Music Plot' }
    };

    Plotly.newPlot('myDiv', plotlyData, layout);
    doPlotlyInteractive()
}

function changeSongToIndex(index) {
    CURRENT_SONG_INDEX = index
    let audio0 = document.getElementById('audio0');
    let textDiv = document.getElementById('textDiv');
    let coordsDiv = document.getElementById('textCoordsDiv');
    let colorDiv = document.getElementById('textColorDiv');

    textDiv.innerText = data[index].id
    coordsDiv.innerText = "x: " + data[index].x + " y: " + data[index].y
    colorDiv.innerText = "color: " + data[index].color
    audio0.src = "/mp3s/" + data[index].mp3


    let styleUpdate = {
        marker: {
            size: 3,
            color: data.map(d => {
                if (d.id == data[index].id) {
                    return "#000000ff";
                }
                return "#" + PLOTLY_COLORMAP[d.color % 32] + "30";
            }),
        }
    };

    Plotly.restyle('myDiv', styleUpdate);

}

function doPlotlyInteractive() {
    // https://plotly.com/javascript/click-events/
    let myPlot = document.getElementById('myDiv');

    myPlot.on('plotly_click', function (plotlyData) {
        console.log(plotlyData.points)
        let pts = '';
        for (let i = 0; i < plotlyData.points.length; i++) {
            pts = 'x = ' + plotlyData.points[i].x + '\ny = ' +
                plotlyData.points[i].y.toPrecision(4) + '\n\n';
            changeSongToIndex(plotlyData.points[i].pointIndex);
        }
        console.log(pts);
        // alert('Closest point clicked:\n\n' + pts);
    });
}

function searchForIndex(id) {
    // really bad code but whatever (hashmap instead maybe)
    // returns the Index in the main list from a song id
    let isCorrectElement = (element) => element.id == id;
    // console.log("search for index", id, "index", data.findIndex(isCorrectElement))
    return data.findIndex(isCorrectElement)
}

function setCurrentSongToClose(closestIndex) {
    //closestIndex: send 1 if closest, 2 if second closest
    if (closestIndex == 1) {
        idToFind = data[CURRENT_SONG_INDEX].close1
        changeSongToIndex(searchForIndex(idToFind))
    }
    else if (closestIndex == 2) {
        idToFind = data[CURRENT_SONG_INDEX].close2
        changeSongToIndex(searchForIndex(idToFind))
    }
}

function loadSongIdFromSearchField() {
    searchField = document.getElementById('searchField');
    changeSongToIndex(searchForIndex(searchField.value))
}

function openSuno() {
    window.open("https://www.suno.com/song/" + data[CURRENT_SONG_INDEX].id, '_blank').focus();
}
function openUdio() {
    window.open("https://www.udio.com/songs/" + data[CURRENT_SONG_INDEX].id, '_blank').focus();
}

// var trace1 = {
//   x: [1, 2, 3, 4, 5],
//   y: [1, 6, 3, 6, 1],
//   mode: 'markers',
//   type: 'scatter',
//   name: 'Team A',
//   text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
//   marker: { size: 12 }
// };

// var trace2 = {
//   x: [1.5, 2.5, 3.5, 4.5, 5.5],
//   y: [4, 1, 7, 1, 4],
//   mode: 'markers',
//   type: 'scatter',
//   name: 'Team B',
//   text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
//   marker: { size: 12 }
// };

