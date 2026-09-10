export const BALANCE={cols:20,rows:14,tile:40,startSun:200,baseHp:700,naturalInterval:5,naturalSun:15,plantCostScaling:{enabled:true,defaultMultiplier:1.20,maxDiscount:.25},debug:false};
export const PLANTS=[
 {id:'peashooter',name:'Peashooter',mark:'P',color:'#70d75e',baseCost:75,hp:150,damage:24,interval:1.05,range:4.1,description:'Disparo preciso • alcance médio'},
 {id:'sunflower',name:'Sunflower',mark:'S',color:'#ffd05a',baseCost:50,hp:100,damage:0,interval:8,range:0,description:'+25 Sun a cada 8 segundos'},
 {id:'wallNut',name:'Wall-Nut',mark:'W',color:'#ce9964',baseCost:50,hp:850,damage:0,interval:1,range:0,description:'Barreira • absorve dano'},
 {id:'repeater',name:'Repeater',mark:'R',color:'#36b980',baseCost:150,hp:160,damage:22,interval:1,range:4.2,description:'Duas ervilhas por ataque'},
 {id:'bonkChoy',name:'Bonk Choy',mark:'B',color:'#a8ed91',baseCost:100,hp:300,damage:35,interval:.45,range:1.5,description:'Corpo a corpo • ataques rápidos'},
 {id:'cabbagePult',name:'Cabbage-Pult',mark:'C',color:'#8aca59',baseCost:175,hp:150,damage:55,interval:2.2,range:6,description:'Artilharia • dano em área'},
 {id:'potatoMine',name:'Potato Mine',mark:'M',color:'#e2bfa5',baseCost:25,hp:80,damage:280,interval:4,range:1,description:'Arma em 4s • explosão única'}
];
export const ZOMBIES=[{name:'Normal',hp:85,speed:.52,damage:15,color:'#9baea0'},{name:'Conehead',hp:210,speed:.47,damage:17,color:'#ee9e52'},{name:'Buckethead',hp:390,speed:.39,damage:24,color:'#afc8d7'}];
export const UPGRADES=[{name:'Ervilhas afiadas',desc:'+15% de dano para todas as plantas',key:'damage',value:1.15},{name:'Crescimento veloz',desc:'+12% de velocidade de ataque',key:'haste',value:1.12},{name:'Raízes profundas',desc:'+20% de vida das plantas atuais e futuras',key:'hp',value:1.2},{name:'Horizonte verde',desc:'+10% de alcance',key:'range',value:1.1},{name:'Dia ensolarado',desc:'+20% de produção de Sun',key:'sun',value:1.2},{name:'Jardim resiliente',desc:'Recupera 25% da vida máxima da base',key:'heal',value:.25}];
