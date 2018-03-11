// https://www.npmjs.com/package/generate-maze

var generator = require( 'generate-maze' );

window.generator = generator;
console.log( 'generator', generator );

let _maze_room = null;

/**
 * 
 */
function draw_map() {
    // pause updater
    clearInterval( update_interval );

    // make map tiles
    let map_gen = generator( 7 );
    map_gen.map( ( row, _y ) => {

        row.map( ( tile, _x ) => {
            console.log( 'tile', tile );

            let x = ( _x * 2 ) + 1;
            let y = ( _y * 2 ) + 1;

            console.log( x, y );
            room[ _maze_room ].tilemap[ y ][ x ] = "0"

            room[ _maze_room ].tilemap[ y - 1 ][ x ] = tile.top ? "a" : "0";
            room[ _maze_room ].tilemap[ y + 1 ][ x ] = tile.bottom ? "a" : "0";
            room[ _maze_room ].tilemap[ y ][ x - 1 ] = tile.left ? "a" : "0";
            room[ _maze_room ].tilemap[ y ][ x + 1 ] = tile.right ? "a" : "0";

            // 
            room[ _maze_room ].tilemap[ y - 1 ][ x - 1 ] = "a";
            room[ _maze_room ].tilemap[ y + 1 ][ x + 1 ] = "a";
            room[ _maze_room ].tilemap[ y - 1 ][ x + 1 ] = "a";
            room[ _maze_room ].tilemap[ y + 1 ][ x - 1 ] = "a";
        } );
    } );

    // setup items to collect
    room[ _maze_room ].items = [];
    for ( var i = 1; i <= 4; i++ ) {
        x = ( ( Math.random() * 4 ).toFixed() * 2 ) + 3;
        y = ( ( Math.random() * 4 ).toFixed() * 2 ) + 3;

        console.log(i);

        room[ _maze_room ].items.push( {
            id: 0,
            x: x,
            y: y
        } )
    }

    // setup exits
    if ( _maze_room == "0" ) {
        room[ _maze_room ].tilemap[ 13 ][ 13 ] = "b";
    } else {
        room[ _maze_room ].tilemap[ 1 ][ 1 ] = "b";
    }

    // restart updater
    update_interval = setInterval( update, -1 );
}
window.draw_map = draw_map;

setInterval( () => {
    if ( _maze_room !== curRoom ) {
        _maze_room = curRoom;

        draw_map();
    }
}, 10 );