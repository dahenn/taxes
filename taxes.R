setwd('C:/Users/dahenn07/Dropbox/datablog/taxes')

require(dplyr)
require(tidyr)
require(ggplot2)
options(scipen=999)

brackets <- read.csv('data/brackets.csv')

calc_tax <- function(amt, type='Single', what) {
    #Deductions
    if (type=='Single') {
        amt.c <- amt - 6300 - 4050
        amt.t <- amt - 12600
    }
    else if (type=='Married') {
        amt.c <- amt - 12600 - 8100 #Assuming no dependents
        amt.t <- amt - 30000
    }
    b <- brackets %>% filter(filing==type)
    
    #What's their top bracket?
    max_b.c <- 0
    max_b.t <- 0
    for (val in 1:9) {
        if (filter(b, level==val)$max > amt.t & max_b.t==0) {
            max_b.t <- val
        }
        if (filter(b, level==val)$max > amt.c & max_b.c==0) {
            max_b.c <- val
        }
    }
    
    #How much do they owe?
    
    b.c <- b %>% filter(level <= max_b.c)
    b.c$tax_amt <- b.c$max - b.c$min
    b.c$tax_amt[b.c$level==max_b.c] <- amt.c - b.c$min[b.c$level==max_b.c]
    b.c$tax <- b.c$tax_amt * (b.c$current/100)
    
    b.t <- b %>% filter(level <= max_b.t)
    b.t$tax_amt <- b.t$max - b.t$min
    b.t$tax_amt[b.t$level==max_b.t] <- amt.t - b.t$min[b.t$level==max_b.t]
    b.t$tax <- b.t$tax_amt * (b.t$trump/100)
    
    current_tax <- sum(b.c$tax)
    trump_tax <- sum(b.t$tax)
    if (what=='current') {final <- current_tax}
    else {final <- trump_tax}
    if (final < 0) {final <- 0}
    final
}

calc_tax_t <- function(amt, type='Single') {
    if (type=='Single') {
        amt <- amt - 12600
    }
    else if (type=='Married') {
        amt <- amt - 30000
    }
    max_b <- 0
    b <- brackets %>% filter(filing==type)
    for (val in 1:9) {
        if (filter(b, level==val)$max > amt & max_b==0) {
            max_b <- val
        }
    }
    b <- b %>% filter(level <= max_b)
    b$tax_amt <- b$max - b$min
    b$tax_amt[b$level==max_b] <- amt - b$min[b$level==max_b]
    b$tax <- b$tax_amt * (b$trump/100)
    f <- sum(b$tax)
    if (f < 0) {f <- 0}
    f
}
calc_tax_c <- function(amt, type='Single') {
    if (type=='Single') {
        amt <- amt - 6300 - 4050
    }
    else if (type=='Married') {
        amt <- amt - 12600 - 8100
    }
    max_b <- 0
    b <- brackets %>% filter(filing==type)
    for (val in 1:9) {
        if (filter(b, level==val)$max > amt & max_b==0) {
            max_b <- val
        }
    }
    b <- b %>% filter(level <= max_b)
    b$tax_amt <- b$max - b$min
    b$tax_amt[b$level==max_b] <- amt - b$min[b$level==max_b]
    b$tax <- b$tax_amt * (b$current/100)
    f <- sum(b$tax)
    if (f < 0) {f <- 0}
    f
}

tax <- data.frame(income = c(seq(0,2000000, by = 1000), seq(2000000,10000000, by = 10000)))
tax$current.single <- mapply(calc_tax_c, tax$income, 'Single')
tax$trump.single <- mapply(calc_tax_t, tax$income, 'Single')
tax$current.married <- mapply(calc_tax_c, tax$income, 'Married')
tax$trump.married <- mapply(calc_tax_t, tax$income, 'Married')

ggplot(data = tax) + geom_line(aes(income, current.single), colour = 'blue') + geom_line(aes(income, trump.single), colour = 'red') + xlim(0,1000000) + ylim(0,500000)
ggplot(data = tax) + geom_line(aes(income, current.married), colour = 'blue') + geom_line(aes(income, trump.married), colour = 'red') + xlim(0,1000000) + ylim(0,500000)

tax$diff.single <- with(tax, trump.single - current.single)
tax$diff.married <- with(tax, trump.married - current.married)
tax$pctincome.single <- with(tax, -diff.single/(income-current.single))
tax$pctincome.married <- with(tax, -diff.married/(income-current.married))

ggplot(data = tax) + geom_line(aes(income, -diff.single)) + xlim(0,1000000) + ylim(-5000,50000)
ggplot(data = tax) + geom_line(aes(income, -diff.married)) + xlim(0,1000000) + ylim(-5000,50000)
ggplot(data = tax) + geom_line(aes(income, pctincome.single)) + xlim(1000,1000000) + ylim(-0.05,0.1)
ggplot(data = tax) + geom_line(aes(income, pctincome.married)) + xlim(1000,1000000) + ylim(-0.05,0.1)
write.csv(tax, file = 'data/tax_calc.csv', row.names = FALSE, na = '0')

dat <- read.table('data/cps_00001.dat')
dat$V1 <- as.character(dat$V1)
dat$year <- mapply(substr, dat$V1, 1,4)
dat$serial <- mapply(substr, dat$V1, 5,9)
dat$hwtsupp <- mapply(substr, dat$V1, 10,19)
dat$asecflag <- mapply(substr, dat$V1, 20,20)
dat$hhincome <- as.integer(mapply(substr, dat$V1, 21,28))
dat$month <- mapply(substr, dat$V1, 29,30)
dat$pernum <- mapply(substr, dat$V1, 31,32)
dat$wtsupp <- mapply(substr, dat$V1, 33,42)
dat$inctot <- as.integer(mapply(substr, dat$V1, 43,50))
dat$incwage <- as.integer(mapply(substr, dat$V1, 51,57))

inc_data <- dat %>% select(serial, hhincome, pernum,inctot, incwage)
inc_data[inc_data==99999999] <- NA
inc_data[inc_data==9999999] <- NA

hhinc <- distinct(inc_data %>% select(serial, hhincome))
hhinc <- hhinc %>% filter(hhincome >= 0)
hhinc$cat <- cut(hhinc$hhincome, breaks = seq(0,2500000,by = 10000), include.lowest = T, right = T, dig.lab = 10, labels = F)

ggplot(hhinc, aes(x=hhincome)) + geom_histogram(binwidth = 10000)
ggplot(hhinc, aes(x=hhincome)) + geom_density()

dist <- hhinc %>% group_by(cat) %>% summarize(n = n(), mean = mean(hhincome))
dist$total <- sum(dist$n)
dist$pct <- with(dist, n/total)

#WHAT TO DO ABOUT MARRIED V SINGLE?
hhinc$current.married <- mapply(calc_tax_c, hhinc$hhincome, 'Married')
hhinc$trump.married <- mapply(calc_tax_t, hhinc$hhincome, 'Married')
hhinc$current.single <- mapply(calc_tax_c, hhinc$hhincome, 'Single')
hhinc$trump.single <- mapply(calc_tax_t, hhinc$hhincome, 'Single')
#60 married, 40 single, via http://www.census.gov/hhes/families/data/cps2016H.html
hhinc$current <- with(hhinc, current.married * 0.6 + current.single * 0.4)
hhinc$trump <- with(hhinc, trump.married * 0.6 + trump.single * 0.4)

tot_current <- sum(hhinc$current)
tot_trump <- sum(hhinc$trump)
tot_trump/tot_current
tot_diff <- (tot_trump - tot_current)*(125800000/69458) #https://www.census.gov/hhes/families/files/hh1.csv
hhinc$pctile <- ecdf(hhinc$hhincome)(hhinc$hhincome)
hhinc$tax_diff <- with(hhinc, trump - current)
hhinc$pct_tax_diff <- with(hhinc, -tax_diff/(hhincome-current))
hhinc$tax_diff_total <- hhinc$tax_diff * (125800000/69458)
pct1_change <- sum((hhinc %>% filter(pctile >= .99))$tax_diff_total)

ggplot(hhinc, aes(x=pctile, y=pct_tax_diff)) + geom_line()
ggplot(hhinc, aes(x=pctile, y=-tax_diff)) + geom_line()

hhinc$pctile_round <- round(hhinc$pctile, digits = 2)*100
hhinc$pct_cat <- cut(hhinc$pctile_round, breaks = seq(0,100,by=1), include.lowest = T, right = T)

avgs <- hhinc %>% group_by(pctile_round, pct_cat) %>% summarize(hhinc = mean(hhincome), medinc = median(hhincome), current = mean(current), trump = mean(trump), tax_diff = mean(tax_diff), pct_tax_diff = mean(pct_tax_diff), tax_diff_total=mean(tax_diff_total))
ggplot(avgs, aes(x=pctile_round, y=pct_tax_diff)) + geom_line()
ggplot(avgs, aes(x=pctile_round-1, y=-tax_diff)) + geom_line()
avgs$inc_round <- round(avgs$medinc/1000)*1000
write.csv(avgs, file = 'data/avgs.csv', row.names = FALSE, na = '0')


payout <- hhinc %>% group_by(pctile_round) %>% summarize(payout = -sum(tax_diff_total))
payout$total <- -tot_diff
payout$pct <- with(payout,payout/tot_diff)
payout$households <- 125800000/100

payout$cat1 <- 'Bottom 50%'
payout$cat1[payout$pctile_round > 50] <- 'Top 50%'
payout$cat2 <- 'Bottom 90%'
payout$cat2[payout$pctile_round > 90] <- 'Top 10%'
payout$cat3 <- 'Bottom 99%'
payout$cat3[payout$pctile_round > 99] <- 'Top 1%'

payout.50 <- payout %>% group_by(cat1) %>% summarize(payout = sum(payout), pct = sum(pct), households = sum(households)) %>% arrange(desc(cat1))
payout.50$perhh <- payout.50$payout / payout.50$households
write.csv(payout.50, file = 'data/payout50.csv', row.names = FALSE, na = '0')

payout.90 <- payout %>% group_by(cat2) %>% summarize(payout = sum(payout), pct = sum(pct), households = sum(households)) %>% arrange(desc(cat2))
payout.90$perhh <- payout.90$payout / payout.90$households
write.csv(payout.90, file = 'data/payout90.csv', row.names = FALSE, na = '0')

payout.99 <- payout %>% group_by(cat3) %>% summarize(payout = sum(payout), pct = sum(pct), households = sum(households)) %>% arrange(desc(cat3))
payout.99$perhh <- payout.99$payout / payout.99$households
write.csv(payout.99, file = 'data/payout99.csv', row.names = FALSE, na = '0')





