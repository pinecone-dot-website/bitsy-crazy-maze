// https://www.npmjs.com/package/generate-maze

let generator = require( 'generate-maze' );

let items = require( './lib/items.js' ),
    markov = require( './lib/markov.js' ),
    sprites = require( './lib/sprites.js' ),
    tiles = require( './lib/tiles.js' );

// offset for tiles, 1 or 2
let room_offset = {
    x: Math.round( Math.random() ) + 1,
    y: Math.round( Math.random() ) + 1
};

// compared with global curRoom var
let _cur_room = null;

/**
 * 
 */
function position_exits() {
    if ( _cur_room == "0" ) {
        x = 12 + room_offset.x;
        y = 12 + room_offset.y;
        room[ _cur_room ].tilemap[ y ][ x ] = "g";
    } else {
        x = room_offset.x;
        y = room_offset.y;
        room[ _cur_room ].tilemap[ y ][ x ] = "g";
    }

    room[ _cur_room ].exits[ 0 ].x = x;
    room[ _cur_room ].exits[ 0 ].y = y;

    // show item for door
    room[ _cur_room ].items.push( {
        id: 4,
        x: x,
        y: y
    } );
}

/**
 * 
 */
function position_player() {
    /*
    // @TODO go to random corner in next room (not same as current)
    let next_room_coords = {
        x: player().x,
        y: player().y
    };

    while ( next_room_coords.x == player().x || next_room_coords.y == player().y ) {
        next_room_coords.x = Math.round( Math.random() ) * 12 + current_offset ;
        next_room_coords.y = Math.round( Math.random() ) * 12 + current_offset 
    }

    alert( JSON.stringify(next_room_coords) );
    */

    if ( _cur_room == "0" ) {
        player().x = room_offset.x;
        player().y = room_offset.y;
    } else {
        player().x = 12 + room_offset.x;
        player().y = 12 + room_offset.y;
    }
}

/**
 * make map tiles
 */
function position_tilemap() {
    // border
    for ( let i = 0; i < 16; i++ ) {
        room[ _cur_room ].tilemap[ 0 ][ i ] = tiles.get_wall();
        room[ _cur_room ].tilemap[ 15 ][ i ] = tiles.get_wall();

        room[ _cur_room ].tilemap[ i ][ 0 ] = tiles.get_wall();
        room[ _cur_room ].tilemap[ i ][ 15 ] = tiles.get_wall();
    }

    // the map
    let map_gen = generator( 7 );

    map_gen.map( ( row, _y ) => {
        row.map( ( tile, _x ) => {
            let x = ( _x * 2 ) + room_offset.x;
            let y = ( _y * 2 ) + room_offset.y;

            room[ _cur_room ].tilemap[ y ][ x ] = tiles.get_path();

            room[ _cur_room ].tilemap[ y - 1 ][ x ] = tile.top ? tiles.get_wall() : tiles.get_path();
            room[ _cur_room ].tilemap[ y + 1 ][ x ] = tile.bottom ? tiles.get_wall() : tiles.get_path();
            room[ _cur_room ].tilemap[ y ][ x - 1 ] = tile.left ? tiles.get_wall() : tiles.get_path();
            room[ _cur_room ].tilemap[ y ][ x + 1 ] = tile.right ? tiles.get_wall() : tiles.get_path();

            // 
            room[ _cur_room ].tilemap[ y - 1 ][ x - 1 ] = tiles.get_wall();
            room[ _cur_room ].tilemap[ y + 1 ][ x + 1 ] = tiles.get_wall();
            room[ _cur_room ].tilemap[ y - 1 ][ x + 1 ] = tiles.get_wall();
            room[ _cur_room ].tilemap[ y + 1 ][ x - 1 ] = tiles.get_wall();
        } );
    } );
}

/**
 * 
 */
function on_interval() {
    // sanity check
    if ( !room[ _cur_room ] ) {
        //alert( "_cur_room not set!?!? : "+JSON.stringify(_cur_room) );
        _cur_room = null;
        return;
    }

    // pause updater
    clearInterval( update_interval );

    // set new variables
    room_offset = {
        x: Math.round( Math.random() ) + 1,
        y: Math.round( Math.random() ) + 1
    };

    // make map tiles
    position_tilemap();

    // setup items to collect
    items.position( _cur_room, room_offset );

    // setup sprite
    sprites.position( _cur_room, room_offset );

    //
    position_player();

    // setup exits
    position_exits();



    // restart updater
    update_interval = setInterval( update, -1 );

    // happens after interval starts again
    items.populate_dialogs();
    sprites.populate_dialogs();
}
window.on_interval = on_interval;



setInterval( () => {
    if ( curRoom && ( _cur_room !== curRoom ) ) {
        _cur_room = curRoom;

        on_interval();
    }
}, 50 );