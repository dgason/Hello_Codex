/* World coordinates are independent of the canvas's CSS size. */
window.SkyGame = {};
SkyGame.levelThemes = [
  {name:'The Floating Garden', sky:['#afe0e9','#e7f4de'], hills:['#a1d4ca','#86cbbb'], soil:'#b4835e', ledge:'#ba8c68', flecks:'#d3a682', grass:'#409a78', tips:'#7fcb85', vine:'#5eaa83', ink:'#37766e', greeting:'Every adventure starts with a leap.'},
  {name:'The Amber Garden', sky:['#f4b69b','#fff0cb'], hills:['#dfb28a','#c99579'], soil:'#a56e61', ledge:'#b57e68', flecks:'#dfad89', grass:'#b16c3e', tips:'#edbb62', vine:'#b47e48', ink:'#754b40', greeting:'Follow the golden light.'},
  {name:'The Twilight Garden', sky:['#b9b5e9','#eee0f4'], hills:['#b3a3d2','#918dbd'], soil:'#82718f', ledge:'#9280a1', flecks:'#bba4c6', grass:'#617eaa', tips:'#9ccbd6', vine:'#779bb8', ink:'#514973', greeting:'One last leap. One more beacon.'}
];
SkyGame.createLevel = function (index=0) {
  const platforms = [
    {x:0,y:452,w:620,h:170}, {x:735,y:452,w:590,h:170},
    {x:1460,y:452,w:590,h:170}, {x:2180,y:452,w:760,h:170},
    {x:260,y:350,w:145,h:26}, {x:475,y:275,w:145,h:26},
    {x:890,y:345,w:187.5,h:26}, {x:1120,y:280,w:140,h:26},
    {x:1590,y:355,w:150,h:26}, {x:1810,y:280,w:145,h:26},
    {x:2280,y:340,w:155,h:26}, {x:2490,y:260,w:145,h:26}
  ];
  const seeds = [[180,405],[300,310],[365,310],[510,235],[575,235],
    [670,330],[805,402],[930,305],[995,305],[1160,240],[1220,240],
    [1390,320],[1530,403],[1630,315],[1695,315],[1850,240],[1915,240],
    [2115,320],[2220,400],[2320,300],[2390,300],[2530,220],[2600,220],[2710,390]]
    .map(([x,y])=>({x,y,w:22,h:28,collected:false}));
  const coins = [[540,239],[1180,204],[2560,224]]
    .map(([x,y])=>({x,y,w:24,h:24,collected:false}));
  return {theme:SkyGame.levelThemes[index],powerUp:{x:215,y:395,w:30,h:36,collected:false},width:2940,platforms,seeds,coins,spawn:{x:72,y:410},goal:{x:2800,y:337,w:65,h:115},
    enemies:[{x:1080,y:420,w:36,h:32,min:1050,max:1290,speed:65,direction:1},
      {x:1880,y:420,w:36,h:32,min:1880,max:1940,speed:45,direction:-1},
      {x:315,y:318,w:36,h:32,min:270,max:359,speed:45,direction:1}]};
};
