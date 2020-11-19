var Entry = function(date, county, state, fips, cases, deaths, confirmed_cases, confirmed_deaths, probable_cases, probable_deaths) {
        this.date = date;
        this.county = county;
        this.state = state;
        this.fips = fips;
        this.cases = cases;
        this.deaths = deaths;
        this.confirmed_cases = confirmed_cases;
        this.confirmed_deaths = confirmed_deaths;
        this.probable_cases = probable_cases;
        this.probable_deaths = probable_deaths;

}

module.exports = Entry;