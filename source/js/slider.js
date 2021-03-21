var slideBefore = document.querySelector('.slider__item--first');
var slideAfter = document.querySelector('.slider__item--second');

var buttonBefore = document.querySelector('.slider__button--before');
var buttonAfter = document.querySelector('.slider__button--after');


buttonBefore.addEventListener('click', function() {
  if (slideBefore.classList.contains('visually-hidden')) {
    slideBefore.classList.remove('visually-hidden');
    slideAfter.classList.add('visually-hidden');
  }
})

buttonAfter.addEventListener('click', function() {
  if (slideAfter.classList.contains('visually-hidden')) {
    slideAfter.classList.remove('visually-hidden');
    slideBefore.classList.add('visually-hidden');
  }
})
