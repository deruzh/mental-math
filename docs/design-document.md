
This document acts design document for local client-side only application that is mental math trainer addition to main course. It consits out of challenge, that limited by 1 minute and measures your skills overall and also lessons that are divided by modules. Selecting a lesson also enables all previous lessons (also from past modules) but trainer starts with 100% probability of new task generator connected to this lesson and it gradually decreases until it becomes equal probability with all others generators.

People should not choose any input field - entering any number enters it to task automatically. They also should not press enter - when correct number is written it automatically consumes it. If number of same number of characters is written but is incorrect, it brights up red, but not skips (so users can use backspace)

There should be starts on time, avg time on questions, number of correct questions, etc...


Requirements:
- The interface should be in russian.
- Users should be allowed to choose lesson number
- Page should not reload at any moment
- New lessons and generators should be added easily
- Should be uploadable to github pages

Vite + React + TypeScript + Tailwind CSS