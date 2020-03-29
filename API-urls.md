
# Rezerwacje z zakresu dat

http://localhost:3131
/
booking
?
date_gte=2020-03-26
&
date_lte=2020-04-08

# Wydarzenia jednorazowe z zakresu dat

http://localhost:3131
/
event
?
repeat=false
&
date_gte=2020-03-26
&
date_lte=2020-04-08

# Wydarzenia codzienne, których rozpoczęcie jest przed datą

http://localhost:3131
/
event
?
repeat_ne=false
&
date_lte=2020-12-31
