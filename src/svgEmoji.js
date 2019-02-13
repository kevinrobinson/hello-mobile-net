import babyBottle from './emoji/baby bottle.svg';
import backpack from './emoji/backpack.svg';
import banana from './emoji/banana.svg';
import baseball from './emoji/baseball.svg';
import basketball from './emoji/basketball.svg';
import bathtub from './emoji/bathtub.svg';
import bed from './emoji/bed.svg';
import beer from './emoji/beer.svg';
import bicycle from './emoji/bicycle.svg';
import bird from './emoji/bird.svg';
import book from './emoji/book.svg';
import bowl from './emoji/bowl.svg';
import bread from './emoji/bread.svg';
import broccoli from './emoji/broccoli.svg';
import building from './emoji/building.svg';
import burrito from './emoji/burrito.svg';
import bus from './emoji/bus.svg';
import cabinet from './emoji/cabinet.svg';
import camera from './emoji/camera.svg';
import candle from './emoji/candle.svg';
import car from './emoji/car.svg';
import cassette from './emoji/cassette.svg';
import cat from './emoji/cat.svg';
import cellphone from './emoji/cellphone.svg';
import clock from './emoji/clock.svg';
import coat from './emoji/coat.svg';
import cup from './emoji/cup.svg';
import display from './emoji/display.svg';
import dog from './emoji/dog.svg';
import donut from './emoji/donut.svg';
import door from './emoji/door.svg';
import envelope from './emoji/envelope.svg';
import fish from './emoji/fish.svg';
import flashlight from './emoji/flashlight.svg';
import flower from './emoji/flower.svg';
import fries from './emoji/fries.svg';
import fryingPan from './emoji/frying pan.svg';
import glove from './emoji/glove.svg';
import guitar from './emoji/guitar.svg';
import hamburger from './emoji/hamburger.svg';
import hammer from './emoji/hammer.svg';
import hand from './emoji/hand.svg';
import hat from './emoji/hat.svg';
import headphones from './emoji/headphones.svg';
import hotdog from './emoji/hotdog.svg';
import house from './emoji/house.svg';
import icecream from './emoji/icecream.svg';
import jackOLantern from './emoji/jack o lantern.svg';
import key from './emoji/key.svg';
import keyboard from './emoji/keyboard.svg';
import laptop from './emoji/laptop.svg';
import lemon from './emoji/lemon.svg';
import lightBulb from './emoji/light bulb.svg';
import lipstick from './emoji/lipstick.svg';
import lock from './emoji/lock.svg';
import magnifyingGlass from './emoji/magnifying glass.svg';
import mailbox from './emoji/mailbox.svg';
import microphone from './emoji/microphone.svg';
import motorScooter from './emoji/motor scooter.svg';
import mouse from './emoji/mouse.svg';
import mushroom from './emoji/mushroom.svg';
import newspaper from './emoji/newspaper.svg';
import orange from './emoji/orange.svg';
import pants from './emoji/pants.svg';
import piano from './emoji/piano.svg';
import pizza from './emoji/pizza.svg';
import plate from './emoji/plate.svg';
import plug from './emoji/plug.svg';
import printer from './emoji/printer.svg';
import radio from './emoji/radio.svg';
import ramen from './emoji/ramen.svg';
import sax from './emoji/sax.svg';
import scarf from './emoji/scarf.svg';
import scissors from './emoji/scissors.svg';
import screw from './emoji/screw.svg';
import shirt from './emoji/shirt.svg';
import shoe from './emoji/shoe.svg';
import soccerBall from './emoji/soccer ball.svg';
import sock from './emoji/sock.svg';
import sofa from './emoji/sofa.svg';
import spoon from './emoji/spoon.svg';
import strawberry from './emoji/strawberry.svg';
import sunglasses from './emoji/sunglasses.svg';
import sushi from './emoji/sushi.svg';
import taco from './emoji/taco.svg';
import toilet from './emoji/toilet.svg';
import trafficLight from './emoji/traffic light.svg';
import trashCan from './emoji/trash can.svg';
import tree from './emoji/tree.svg';
import truck from './emoji/truck.svg';
import tv from './emoji/tv.svg';
import umbrella from './emoji/umbrella.svg';
import wallet from './emoji/wallet.svg';
import watch from './emoji/watch.svg';
import wine from './emoji/wine.svg';


const map = {
  'baby bottle': babyBottle,
  backpack: backpack,
  banana: banana,
  baseball: baseball,
  basketball: basketball,
  bathtub: bathtub,
  bed: bed,
  beer: beer,
  bicycle: bicycle,
  bird: bird,
  book: book,
  bowl: bowl,
  bread: bread,
  broccoli: broccoli,
  building: building,
  burrito: burrito,
  bus: bus,
  cabinet: cabinet,
  camera: camera,
  candle: candle,
  car: car,
  cassette: cassette,
  cat: cat,
  cellphone: cellphone,
  clock: clock,
  coat: coat,
  cup: cup,
  display: display,
  dog: dog,
  donut: donut,
  door: door,
  envelope: envelope,
  fish: fish,
  flashlight: flashlight,
  flower: flower,
  fries: fries,
  'frying pan': fryingPan,
  glove: glove,
  guitar: guitar,
  hamburger: hamburger,
  hammer: hammer,
  hand: hand,
  hat: hat,
  headphones: headphones,
  hotdog: hotdog,
  house: house,
  icecream: icecream,
  'jack o lantern': jackOLantern,
  key: key,
  keyboard: keyboard,
  laptop: laptop,
  lemon: lemon,
  'light bulb': lightBulb,
  lipstick: lipstick,
  lock: lock,
  'magnifying glass': magnifyingGlass,
  mailbox: mailbox,
  microphone: microphone,
  motorScooter: motorScooter,
  mouse: mouse,
  mushroom: mushroom,
  newspaper: newspaper,
  orange: orange,
  pants: pants,
  piano: piano,
  pizza: pizza,
  plate: plate,
  plug: plug,
  printer: printer,
  radio: radio,
  ramen: ramen,
  sax: sax,
  scarf: scarf,
  scissors: scissors,
  screw: screw,
  shirt: shirt,
  shoe: shoe,
  'soccer ball': soccerBall,
  sock: sock,
  sofa: sofa,
  spoon: spoon,
  strawberry: strawberry,
  sunglasses: sunglasses,
  sushi: sushi,
  taco: taco,
  toilet: toilet,
  'traffic light': trafficLight,
  trashCan: trashCan,
  tree: tree,
  truck: truck,
  tv: tv,
  umbrella: umbrella,
  wallet: wallet,
  watch: watch,
  wine: wine
};

export function toSvg(label) {
  return map[label];
}
