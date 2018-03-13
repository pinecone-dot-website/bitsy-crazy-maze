const sprite_paths = [ 'd', 'e', 'f' ];
const sprite_walls = [ 'a', 'b', 'c' ];

module.exports = {
    /**
     * gets random path (walking) tile 
     * @return string 
     */
    get_path: function() {
        let i = Math.floor( Math.random() * 3 );

        return sprite_paths[ i ];
    },

    /**
     * gets random wall (block) tile
     * @return string 
     */
    get_wall: function() {
        let i = Math.floor( Math.random() * 3 );

        return sprite_walls[ i ];
    }
}