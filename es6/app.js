// https://www.npmjs.com/package/generate-maze
let items = require( './lib/items.js' ),
    room_ = require( './lib/room.js' ),
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
 * 
 */
function interval_callback() {
    // sanity check
    if ( !room[ _cur_room ] ) {
        //alert( "_cur_room not set!?!? : "+JSON.stringify(_cur_room) );
        _cur_room = null;
        return;
    }

    // pause bitsy updater
    clearInterval( window.update_interval );

    // set new variables
    room_offset = {
        x: Math.round( Math.random() ) + 1,
        y: Math.round( Math.random() ) + 1
    };

    // make map tiles and place exits
    room_.draw_map( _cur_room, room_offset );
    room_.position_exits( _cur_room, room_offset );

    // setup items to collect
    items.position( _cur_room, room_offset );
    
    // setup sprite
    sprites.position( _cur_room, room_offset );

    //
    position_player();

    // restart bitsy updater
    window.update_interval = setInterval( update, -1 );
    
    // happens after interval starts again
    items.populate_dialogs();
    sprites.populate_dialogs();
}

/**
 * 
 */
function game_interval() {
    if ( curRoom && ( _cur_room !== curRoom ) ) {
        _cur_room = curRoom;

        interval_callback();
    }
}

/**
 * 
 */
function bootstrap() {
    if ( curRoom && ( _cur_room !== curRoom ) ) {
        _cur_room = curRoom;

        interval_callback();

        // run once stuff below
        room_.draw_border( 0 );
        room_.draw_border( 1 );

        clearInterval( bootstrap_interval );
        setInterval( game_interval, 50 );
    }
}

let bootstrap_interval = setInterval( bootstrap, 50 );