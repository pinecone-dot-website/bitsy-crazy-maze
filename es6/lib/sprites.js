/**
 * Sprites
 * These are the characters that are positioned on the wall tiles
 * Has longer dialog
 */

const sprite_tiles = [ 'b', 'c', 'd' ],
      Markov = require( './markov.js' ),
      markov = new Markov(280);

module.exports = {
    /**
     * 
     */
    populate_dialogs: function() {
        sprite_tiles.forEach( ( e, i ) => {
            let id = `SPR_${i}`,
                text = markov.generate();

            dialog[ id ] = text;
            scriptInterpreter.Compile( id, text );

            //responsiveVoice.speak( text );
        } );
    },

    /**
     * 
     */
    position: function( _cur_room, room_offset ) {
        let threshold = .75;

        sprite_tiles.forEach( ( tile, i ) => {
            if ( Math.random() > threshold ) {
                x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x + 1;
                y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y + 1;

                sprite[ tile ].room = _cur_room;
                sprite[ tile ].x = x;
                sprite[ tile ].y = y;
            } else {
                sprite[ tile ].room = 100;
            }
        } );
    }
}