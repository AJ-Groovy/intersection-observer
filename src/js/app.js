// You can write a call and import your functions in this file.
//
// This file will be compiled into app.js and will not be minified.
// Feel free with using ES6 here.

import IObserver from './modules/intersection'


(($) => {

  $(() => {

    console.log(IObserver);


    const handleIntersection = function (entries, observer) {
      entries.forEach(function (entry) {
        if(entry.isIntersecting && entry.intersectionRatio === 1){
          const entryClassList = entry.target.classList;
          if(!entryClassList.contains('animated')){
            entryClassList.add('animated')
          }
        }
      });
    };

    const io = new IObserver(handleIntersection, {
      steps: 100,
      initialTrigger: false,
      offsetBottom: '-50%',
    });

    const io2 = new IObserver(handleIntersection, {
      steps: 20,
      initialTrigger: false,
      // offsetTop: '-50vh',
      offsetBottom: '-10px',
    });


    const items = document.querySelectorAll('.box');
    const items2 = document.querySelectorAll('.box-2');
    io.observe(items);
    io2.observe(items2);


    const unobserveIo1 = document.querySelector('.unobserve-1');
    const unobserveIo2 = document.querySelector('.unobserve-2');

    unobserveIo1.addEventListener('click', io.destroy.bind(io));
    unobserveIo2.addEventListener('click', io2.destroy.bind(io2));

  });
})(jQuery);