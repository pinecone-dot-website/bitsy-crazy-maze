/**
 * Items
 * These are the item the player picks up along the way
 * SHorter dialog
 */

const item_tiles = [ 0, 1, 2, 3 ],
      Markov = require( './markov.js' ),
      markov = new Markov(160);

module.exports = {
    /**
     * 
     */
    populate_dialogs: function() {
        let dialogs = [];
        
        // this avoids any empty dialogs
        while( dialogs.length < item_tiles.length ){
            let text = markov.generate();
            
            if(text.length){
                dialogs.push(text);
            }
        }

        item_tiles.forEach( ( e, i ) => {
            let id = `ITM_${i}`;
            
            window.dialog[ id ] = dialogs[i];
            window.scriptInterpreter.Compile( id, dialogs[i] );
        } );
    },

    /**
     * 
     */
    position: function( _cur_room, room_offset ) {
        let threshold = .5;

        item_tiles.forEach( ( tile, i ) => {
            if ( Math.random() > threshold ) {
                x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x;
                y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y;

                room[ _cur_room ].items.push( {
                    id: i,
                    x: x,
                    y: y
                } );
            }
        });
    }
}