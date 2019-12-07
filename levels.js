let tilesize = 32;
let levels = [
  ["wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
   "w                                                                     wwwwwwwwwwwwwwwwww                  s                    w",
   "w    w                                                                wwwwwwwwwwwwwwwwww                  s                    w",
   "w    w                                                                wwwwwwwwwwwwwwwwww                  s                    w",
   "w    w                                                                wwwwwwwwwwwwwwwwww                  s                    w",
   "w    ww                                                               wwwwwwwwwwwwwwwwww                  s                    w",
   "w    w                                                                wwwwwwwwwwwwwwwwww                  s                    w",
   "w    wwwww                                                            wwwwwwwwwwwwwwwwww                  s                    w",
   "w    w       s                                                        wwwwwwwwwwwwwwwwww                  s                    w",
   "w    wcccccccc                                                        wwwwwwwwwwwwwwwwww                  s                    w",
   "w    wwwwwwwww                                                        wwwwwwwwwwwwwwwwww                  s                    w",
   "w                 p          t                            Bb          wwwwwwwwwwwwwwwwww                  s                    w",
   "w                 w ccc s    wtt                          bb          wwwwwwwwwwwwwwwwww                  s                    w",
   "w            s    wwwwwwwwwwwwtt                                      wwwwwwwwwwwwwwwwww                  s                    w",
   "w    www     w                                                        wwwwwwwwwwwwwwwwww                  s                    w",
   "w    www     w                        s                               wwwwwwwwwwwwwwwwww                  s                    w",
   "w    www     w                        s                               wwwwwwwwwwwwwwwwww                  s                    w",
   "w              wwwwwww                s                               wwwwwwwwwwwwwwwwww                   w                   w",
   "w    www         w                    s                               wwwwwwwwwwwwwwwwww                  www                  w",
   "w                                                                     wwwwwwwwwwwwwwwwww                wwwwwww                w",
   "w                                                                     wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "w                                 s                                                                  wwwwwwwwwwwww             w",
   "w                                 s                                                                  wwwwwwwwwwwww             w",
   "w                                 s                                   wwwwwwwwwwwwwwwwww             wwwwwwwwwwwww             w",
   "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
  ]
];
