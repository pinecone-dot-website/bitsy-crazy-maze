// https://www.npmjs.com/package/generate-maze

let generator = require('generate-maze'),
    markov = require('simple-markov');


window.generator = generator;
window.markov = markov;

console.log('generator', generator);
console.log('markov', markov);

let _maze_room = null;

/**
 * 
 */
function draw_map() {
    // pause updater
    clearInterval(update_interval);

    // make map tiles
    let map_gen = generator(7);
    map_gen.map((row, _y) => {

        row.map((tile, _x) => {
            //console.log( 'tile', tile );

            let x = (_x * 2) + 1;
            let y = (_y * 2) + 1;

            //console.log( x, y );
            room[_maze_room].tilemap[y][x] = "0"

            room[_maze_room].tilemap[y - 1][x] = tile.top ? "a" : "0";
            room[_maze_room].tilemap[y + 1][x] = tile.bottom ? "a" : "0";
            room[_maze_room].tilemap[y][x - 1] = tile.left ? "a" : "0";
            room[_maze_room].tilemap[y][x + 1] = tile.right ? "a" : "0";

            // 
            room[_maze_room].tilemap[y - 1][x - 1] = "a";
            room[_maze_room].tilemap[y + 1][x + 1] = "a";
            room[_maze_room].tilemap[y - 1][x + 1] = "a";
            room[_maze_room].tilemap[y + 1][x - 1] = "a";
        });
    });

    // setup items to collect
    room[_maze_room].items = [];
    for (var i = 0; i <= 3; i++) {
        x = ((Math.random() * 4).toFixed() * 2) + 3;
        y = ((Math.random() * 4).toFixed() * 2) + 3;

        //console.log(i);

        room[_maze_room].items.push({
            id: i,
            x: x,
            y: y
        });
    }

    // setup exits
    if (_maze_room == "0") {
        room[_maze_room].tilemap[13][13] = "b";
    } else {
        room[_maze_room].tilemap[1][1] = "b";
    }

    // restart updater
    update_interval = setInterval(update, -1);

    populate_dialogs();
}
window.draw_map = draw_map;

/**
 * 
 */
function populate_dialogs() {
    for (var i = 0; i <= 3; i++) {
        let id = `ITM_${i}`;
        let text = mkv.generateText(150);
        dialog[id] = text;

        console.log(id, dialog[id]);
    }
}
window.populate_dialogs = populate_dialogs;

setInterval(() => {
    if (_maze_room !== curRoom) {
        _maze_room = curRoom;

        draw_map();
    }
}, 10);

let markov_dialog = `The majority of games on this list mostly fall under the visual novel.
People say that we're born with a purpose And that we're meant to make our dreams come true But if our dreams start to crumble they can bury us
Got to dig yourself out and push on through They say that nobody changes
But I'm living proof that they do
Because I found the answer And you can find the answer too
They made me think I was crazy
And that the pain was here to stay But now that I found the answer I'm never ever gunna lose my way
A winter's day, a bitter snowflake on my face
My summer girl takes little backward steps away
And I saw the multitude of faces, honest, rich and clean
As the merchandise exchanged and money roared
And a woman hot with worry slyly slipped a tin of stewing steak
Into the paper bag at her side
And her face was white with fear in case her actions were observed
So she closed her eyes to keep her conscience blind
Then she moved toward the exit clutching tightly at her paper bag
Perspiration trickled down her forehead
And her heart it leapt inside her as the hand laid on her shoulder
She was led away bewildered and amazed
Through her deafened ears the cash machines were shrieking on the counter
As her escort asked her softly for her name
And a crowd of honest people rushed to help a tired old lady
Who had fainted to the whirling
wooden floor. When, in the course of development, class distinctions have disappeared, 
and all production has been concentrated in the hands of a vast association of the whole nation, the public power will lose its political character. Political power, properly so called, is merely the organised power of one class for oppressing another. If the proletariat during its contest with the bourgeoisie is compelled, by the force of circumstances, to organise itself as a class, if, by means of a revolution, it makes itself the ruling class, and, as such, sweeps away by force the old conditions of production, then it will, along with these conditions, have swept away the conditions for the existence of class antagonisms and of classes generally, and will thereby have abolished its own supremacy as a class. 
I laughed and shook his hand, And made my way back home
I searched for form and land, For years and years I roamed I gazed a gazely stare
At all the millions here We must have died alone,
A long-long time ago Modern Industry has converted the little workshop of the patriarchal master into the great factory of the industrial capitalist. Masses of labourers, crowded into the factory, are organised like soldiers. As privates of the industrial army they are placed under the command of a perfect hierarchy of officers and sergeants. Not only are they slaves of the bourgeois class, and of the bourgeois State; they are daily and hourly enslaved by the machine, by the overlooker, and, above all, by the individual bourgeois manufacturer himself. The more openly this despotism proclaims gain to be its end and aim, the more petty, the more hateful and the more embittering it is.
The less the skill and exertion of strength implied in manual labour, in other words, the more modern industry becomes developed, the more is the labour of men superseded by that of women. Differences of age and sex have no longer any distinctive social validity for the working class. All are instruments of labour, more or less expensive to use, according to their age and sex.
No sooner is the exploitation of the labourer by the manufacturer, so far, at an end, that he receives his wages in cash, than he is set upon by the other portions of the bourgeoisie, the landlord, the shopkeeper, the pawnbroker, etc.
The lower strata of the middle class — the small tradespeople, shopkeepers, and retired tradesmen generally, the handicraftsmen and peasants — all these sink gradually into the proletariat, partly because their diminutive capital does not suffice for the scale on which Modern Industry is carried on, and is swamped in the competition with the large capitalists, partly because their specialised skill is rendered worthless by new methods of production. Thus the proletariat is recruited from all classes of the population.
The proletariat goes through various stages of development. With its birth begins its struggle with the bourgeoisie. At first the contest is carried on by individual labourers, then by the workpeople of a factory, then by the operative of one trade, in one locality, against the individual bourgeois who directly exploits them. They direct their attacks not against the bourgeois conditions of production, but against the instruments of production themselves; they destroy imported wares that compete with their labour, they smash to pieces machinery, they set factories ablaze, they seek to restore by force the vanished status of the workman of the Middle Ages.
At this stage, the labourers still form an incoherent mass scattered over the whole country, and broken up by their mutual competition. If anywhere they unite to form more compact bodies, this is not yet the consequence of their own active union, but of the union of the bourgeoisie, which class, in order to attain its own political ends, is compelled to set the whole proletariat in motion, and is moreover yet, for a time, able to do so. At this stage, therefore, the proletarians do not fight their enemies, but the enemies of their enemies, the remnants of absolute monarchy, the landowners, the non-industrial bourgeois, the petty bourgeois. Thus, the whole historical movement is concentrated in the hands of the bourgeoisie; every victory so obtained is a victory for the bourgeoisie.
But with the development of industry, the proletariat not only increases in number; it becomes concentrated in greater masses, its strength grows, and it feels that strength more. The various interests and conditions of life within the ranks of the proletariat are more and more equalised, in proportion as machinery obliterates all distinctions of labour, and nearly everywhere reduces wages to the same low level. The growing competition among the bourgeois, and the resulting commercial crises, make the wages of the workers ever more fluctuating. The increasing improvement of machinery, ever more rapidly developing, makes their livelihood more and more precarious; the collisions between individual workmen and individual bourgeois take more and more the character of collisions between two classes. Thereupon, the workers begin to form combinations (Trades’ Unions) against the bourgeois; they club together in order to keep up the rate of wages; they found permanent associations in order to make provision beforehand for these occasional revolts. Here and there, the contest breaks out into riots. `;
let mkv = new markov(3, markov_dialog);
//window.mkv = mkv;