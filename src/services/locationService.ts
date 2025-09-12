// Location service for city autocomplete functionality

export interface Country {
  value: string
  label: string
  code: string
}

export interface City {
  name: string
  country: string
  countryCode: string
  state?: string
  lat?: number
  lng?: number
}

class LocationService {
  private countries: Country[] = []
  private citiesCache: Map<string, City[]> = new Map()

  constructor() {
    this.initializeCountries()
  }

  private initializeCountries() {
    // Using a static list of countries instead of the problematic library
    this.countries = [
      { value: 'US', label: 'United States', code: 'US' },
      { value: 'CA', label: 'Canada', code: 'CA' },
      { value: 'GB', label: 'United Kingdom', code: 'GB' },
      { value: 'DE', label: 'Germany', code: 'DE' },
      { value: 'FR', label: 'France', code: 'FR' },
      { value: 'AU', label: 'Australia', code: 'AU' },
      { value: 'JP', label: 'Japan', code: 'JP' },
      { value: 'IN', label: 'India', code: 'IN' },
      { value: 'BR', label: 'Brazil', code: 'BR' },
      { value: 'MX', label: 'Mexico', code: 'MX' },
      { value: 'IT', label: 'Italy', code: 'IT' },
      { value: 'ES', label: 'Spain', code: 'ES' },
      { value: 'NL', label: 'Netherlands', code: 'NL' },
      { value: 'SE', label: 'Sweden', code: 'SE' },
      { value: 'NO', label: 'Norway', code: 'NO' },
      { value: 'DK', label: 'Denmark', code: 'DK' },
      { value: 'FI', label: 'Finland', code: 'FI' },
      { value: 'CH', label: 'Switzerland', code: 'CH' },
      { value: 'AT', label: 'Austria', code: 'AT' },
      { value: 'BE', label: 'Belgium', code: 'BE' },
      { value: 'IE', label: 'Ireland', code: 'IE' },
      { value: 'PT', label: 'Portugal', code: 'PT' },
      { value: 'PL', label: 'Poland', code: 'PL' },
      { value: 'CZ', label: 'Czech Republic', code: 'CZ' },
      { value: 'HU', label: 'Hungary', code: 'HU' },
      { value: 'RO', label: 'Romania', code: 'RO' },
      { value: 'BG', label: 'Bulgaria', code: 'BG' },
      { value: 'HR', label: 'Croatia', code: 'HR' },
      { value: 'SI', label: 'Slovenia', code: 'SI' },
      { value: 'SK', label: 'Slovakia', code: 'SK' },
      { value: 'LT', label: 'Lithuania', code: 'LT' },
      { value: 'LV', label: 'Latvia', code: 'LV' },
      { value: 'EE', label: 'Estonia', code: 'EE' },
      { value: 'GR', label: 'Greece', code: 'GR' },
      { value: 'CY', label: 'Cyprus', code: 'CY' },
      { value: 'MT', label: 'Malta', code: 'MT' },
      { value: 'LU', label: 'Luxembourg', code: 'LU' },
      { value: 'IS', label: 'Iceland', code: 'IS' },
      { value: 'LI', label: 'Liechtenstein', code: 'LI' },
      { value: 'MC', label: 'Monaco', code: 'MC' },
      { value: 'SM', label: 'San Marino', code: 'SM' },
      { value: 'VA', label: 'Vatican City', code: 'VA' },
      { value: 'AD', label: 'Andorra', code: 'AD' },
      { value: 'SG', label: 'Singapore', code: 'SG' },
      { value: 'HK', label: 'Hong Kong', code: 'HK' },
      { value: 'TW', label: 'Taiwan', code: 'TW' },
      { value: 'KR', label: 'South Korea', code: 'KR' },
      { value: 'TH', label: 'Thailand', code: 'TH' },
      { value: 'MY', label: 'Malaysia', code: 'MY' },
      { value: 'ID', label: 'Indonesia', code: 'ID' },
      { value: 'PH', label: 'Philippines', code: 'PH' },
      { value: 'VN', label: 'Vietnam', code: 'VN' },
      { value: 'CN', label: 'China', code: 'CN' },
      { value: 'RU', label: 'Russia', code: 'RU' },
      { value: 'TR', label: 'Turkey', code: 'TR' },
      { value: 'IL', label: 'Israel', code: 'IL' },
      { value: 'AE', label: 'United Arab Emirates', code: 'AE' },
      { value: 'SA', label: 'Saudi Arabia', code: 'SA' },
      { value: 'EG', label: 'Egypt', code: 'EG' },
      { value: 'ZA', label: 'South Africa', code: 'ZA' },
      { value: 'NG', label: 'Nigeria', code: 'NG' },
      { value: 'KE', label: 'Kenya', code: 'KE' },
      { value: 'GH', label: 'Ghana', code: 'GH' },
      { value: 'MA', label: 'Morocco', code: 'MA' },
      { value: 'TN', label: 'Tunisia', code: 'TN' },
      { value: 'DZ', label: 'Algeria', code: 'DZ' },
      { value: 'LY', label: 'Libya', code: 'LY' },
      { value: 'SD', label: 'Sudan', code: 'SD' },
      { value: 'ET', label: 'Ethiopia', code: 'ET' },
      { value: 'UG', label: 'Uganda', code: 'UG' },
      { value: 'TZ', label: 'Tanzania', code: 'TZ' },
      { value: 'ZW', label: 'Zimbabwe', code: 'ZW' },
      { value: 'BW', label: 'Botswana', code: 'BW' },
      { value: 'NA', label: 'Namibia', code: 'NA' },
      { value: 'ZM', label: 'Zambia', code: 'ZM' },
      { value: 'MW', label: 'Malawi', code: 'MW' },
      { value: 'MZ', label: 'Mozambique', code: 'MZ' },
      { value: 'MG', label: 'Madagascar', code: 'MG' },
      { value: 'MU', label: 'Mauritius', code: 'MU' },
      { value: 'SC', label: 'Seychelles', code: 'SC' },
      { value: 'AR', label: 'Argentina', code: 'AR' },
      { value: 'CL', label: 'Chile', code: 'CL' },
      { value: 'CO', label: 'Colombia', code: 'CO' },
      { value: 'PE', label: 'Peru', code: 'PE' },
      { value: 'VE', label: 'Venezuela', code: 'VE' },
      { value: 'EC', label: 'Ecuador', code: 'EC' },
      { value: 'BO', label: 'Bolivia', code: 'BO' },
      { value: 'PY', label: 'Paraguay', code: 'PY' },
      { value: 'UY', label: 'Uruguay', code: 'UY' },
      { value: 'GY', label: 'Guyana', code: 'GY' },
      { value: 'SR', label: 'Suriname', code: 'SR' },
      { value: 'FK', label: 'Falkland Islands', code: 'FK' },
      { value: 'NZ', label: 'New Zealand', code: 'NZ' },
      { value: 'FJ', label: 'Fiji', code: 'FJ' },
      { value: 'PG', label: 'Papua New Guinea', code: 'PG' },
      { value: 'SB', label: 'Solomon Islands', code: 'SB' },
      { value: 'VU', label: 'Vanuatu', code: 'VU' },
      { value: 'NC', label: 'New Caledonia', code: 'NC' },
      { value: 'PF', label: 'French Polynesia', code: 'PF' },
      { value: 'WS', label: 'Samoa', code: 'WS' },
      { value: 'TO', label: 'Tonga', code: 'TO' },
      { value: 'KI', label: 'Kiribati', code: 'KI' },
      { value: 'TV', label: 'Tuvalu', code: 'TV' },
      { value: 'NR', label: 'Nauru', code: 'NR' },
      { value: 'PW', label: 'Palau', code: 'PW' },
      { value: 'FM', label: 'Micronesia', code: 'FM' },
      { value: 'MH', label: 'Marshall Islands', code: 'MH' },
      { value: 'MP', label: 'Northern Mariana Islands', code: 'MP' },
      { value: 'GU', label: 'Guam', code: 'GU' },
      { value: 'AS', label: 'American Samoa', code: 'AS' },
      { value: 'VI', label: 'U.S. Virgin Islands', code: 'VI' },
      { value: 'PR', label: 'Puerto Rico', code: 'PR' },
      { value: 'DO', label: 'Dominican Republic', code: 'DO' },
      { value: 'CU', label: 'Cuba', code: 'CU' },
      { value: 'JM', label: 'Jamaica', code: 'JM' },
      { value: 'HT', label: 'Haiti', code: 'HT' },
      { value: 'TT', label: 'Trinidad and Tobago', code: 'TT' },
      { value: 'BB', label: 'Barbados', code: 'BB' },
      { value: 'BS', label: 'Bahamas', code: 'BS' },
      { value: 'BZ', label: 'Belize', code: 'BZ' },
      { value: 'GT', label: 'Guatemala', code: 'GT' },
      { value: 'SV', label: 'El Salvador', code: 'SV' },
      { value: 'HN', label: 'Honduras', code: 'HN' },
      { value: 'NI', label: 'Nicaragua', code: 'NI' },
      { value: 'CR', label: 'Costa Rica', code: 'CR' },
      { value: 'PA', label: 'Panama', code: 'PA' }
    ]
  }

  getCountries(): Country[] {
    return this.countries
  }

  getCountryByCode(code: string): Country | undefined {
    return this.countries.find(country => country.code === code)
  }

  // Mock city data - in production, you would use a real API like:
  // - OpenWeatherMap Cities API
  // - GeoNames API
  // - Google Places API
  private getMockCities(countryCode: string): City[] {
    const mockCities: Record<string, City[]> = {
      'US': [
        { name: 'New York', country: 'United States', countryCode: 'US', state: 'NY' },
        { name: 'Los Angeles', country: 'United States', countryCode: 'US', state: 'CA' },
        { name: 'Chicago', country: 'United States', countryCode: 'US', state: 'IL' },
        { name: 'Houston', country: 'United States', countryCode: 'US', state: 'TX' },
        { name: 'Phoenix', country: 'United States', countryCode: 'US', state: 'AZ' },
        { name: 'Philadelphia', country: 'United States', countryCode: 'US', state: 'PA' },
        { name: 'San Antonio', country: 'United States', countryCode: 'US', state: 'TX' },
        { name: 'San Diego', country: 'United States', countryCode: 'US', state: 'CA' },
        { name: 'Dallas', country: 'United States', countryCode: 'US', state: 'TX' },
        { name: 'San Jose', country: 'United States', countryCode: 'US', state: 'CA' },
        { name: 'Austin', country: 'United States', countryCode: 'US', state: 'TX' },
        { name: 'Jacksonville', country: 'United States', countryCode: 'US', state: 'FL' },
        { name: 'Fort Worth', country: 'United States', countryCode: 'US', state: 'TX' },
        { name: 'Columbus', country: 'United States', countryCode: 'US', state: 'OH' },
        { name: 'Charlotte', country: 'United States', countryCode: 'US', state: 'NC' },
        { name: 'San Francisco', country: 'United States', countryCode: 'US', state: 'CA' },
        { name: 'Indianapolis', country: 'United States', countryCode: 'US', state: 'IN' },
        { name: 'Seattle', country: 'United States', countryCode: 'US', state: 'WA' },
        { name: 'Denver', country: 'United States', countryCode: 'US', state: 'CO' },
        { name: 'Washington', country: 'United States', countryCode: 'US', state: 'DC' }
      ],
      'CA': [
        { name: 'Toronto', country: 'Canada', countryCode: 'CA', state: 'ON' },
        { name: 'Montreal', country: 'Canada', countryCode: 'CA', state: 'QC' },
        { name: 'Vancouver', country: 'Canada', countryCode: 'CA', state: 'BC' },
        { name: 'Calgary', country: 'Canada', countryCode: 'CA', state: 'AB' },
        { name: 'Edmonton', country: 'Canada', countryCode: 'CA', state: 'AB' },
        { name: 'Ottawa', country: 'Canada', countryCode: 'CA', state: 'ON' },
        { name: 'Winnipeg', country: 'Canada', countryCode: 'CA', state: 'MB' },
        { name: 'Quebec City', country: 'Canada', countryCode: 'CA', state: 'QC' },
        { name: 'Hamilton', country: 'Canada', countryCode: 'CA', state: 'ON' },
        { name: 'Kitchener', country: 'Canada', countryCode: 'CA', state: 'ON' },
        { name: 'London', country: 'Canada', countryCode: 'CA', state: 'ON' },
        { name: 'Victoria', country: 'Canada', countryCode: 'CA', state: 'BC' },
        { name: 'Halifax', country: 'Canada', countryCode: 'CA', state: 'NS' },
        { name: 'Oshawa', country: 'Canada', countryCode: 'CA', state: 'ON' },
        { name: 'Windsor', country: 'Canada', countryCode: 'CA', state: 'ON' }
      ],
      'GB': [
        { name: 'London', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Birmingham', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Manchester', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Glasgow', country: 'United Kingdom', countryCode: 'GB', state: 'Scotland' },
        { name: 'Liverpool', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Leeds', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Sheffield', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', state: 'Scotland' },
        { name: 'Bristol', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Newcastle', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Nottingham', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Leicester', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Coventry', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Bradford', country: 'United Kingdom', countryCode: 'GB', state: 'England' },
        { name: 'Cardiff', country: 'United Kingdom', countryCode: 'GB', state: 'Wales' }
      ],
      'DE': [
        { name: 'Berlin', country: 'Germany', countryCode: 'DE', state: 'Berlin' },
        { name: 'Hamburg', country: 'Germany', countryCode: 'DE', state: 'Hamburg' },
        { name: 'Munich', country: 'Germany', countryCode: 'DE', state: 'Bavaria' },
        { name: 'Cologne', country: 'Germany', countryCode: 'DE', state: 'North Rhine-Westphalia' },
        { name: 'Frankfurt', country: 'Germany', countryCode: 'DE', state: 'Hesse' },
        { name: 'Stuttgart', country: 'Germany', countryCode: 'DE', state: 'Baden-Württemberg' },
        { name: 'Düsseldorf', country: 'Germany', countryCode: 'DE', state: 'North Rhine-Westphalia' },
        { name: 'Dortmund', country: 'Germany', countryCode: 'DE', state: 'North Rhine-Westphalia' },
        { name: 'Essen', country: 'Germany', countryCode: 'DE', state: 'North Rhine-Westphalia' },
        { name: 'Leipzig', country: 'Germany', countryCode: 'DE', state: 'Saxony' },
        { name: 'Bremen', country: 'Germany', countryCode: 'DE', state: 'Bremen' },
        { name: 'Dresden', country: 'Germany', countryCode: 'DE', state: 'Saxony' },
        { name: 'Hannover', country: 'Germany', countryCode: 'DE', state: 'Lower Saxony' },
        { name: 'Nuremberg', country: 'Germany', countryCode: 'DE', state: 'Bavaria' },
        { name: 'Duisburg', country: 'Germany', countryCode: 'DE', state: 'North Rhine-Westphalia' }
      ],
      'FR': [
        { name: 'Paris', country: 'France', countryCode: 'FR', state: 'Île-de-France' },
        { name: 'Marseille', country: 'France', countryCode: 'FR', state: 'Provence-Alpes-Côte d\'Azur' },
        { name: 'Lyon', country: 'France', countryCode: 'FR', state: 'Auvergne-Rhône-Alpes' },
        { name: 'Toulouse', country: 'France', countryCode: 'FR', state: 'Occitanie' },
        { name: 'Nice', country: 'France', countryCode: 'FR', state: 'Provence-Alpes-Côte d\'Azur' },
        { name: 'Nantes', country: 'France', countryCode: 'FR', state: 'Pays de la Loire' },
        { name: 'Strasbourg', country: 'France', countryCode: 'FR', state: 'Grand Est' },
        { name: 'Montpellier', country: 'France', countryCode: 'FR', state: 'Occitanie' },
        { name: 'Bordeaux', country: 'France', countryCode: 'FR', state: 'Nouvelle-Aquitaine' },
        { name: 'Lille', country: 'France', countryCode: 'FR', state: 'Hauts-de-France' },
        { name: 'Rennes', country: 'France', countryCode: 'FR', state: 'Brittany' },
        { name: 'Reims', country: 'France', countryCode: 'FR', state: 'Grand Est' },
        { name: 'Le Havre', country: 'France', countryCode: 'FR', state: 'Normandy' },
        { name: 'Saint-Étienne', country: 'France', countryCode: 'FR', state: 'Auvergne-Rhône-Alpes' },
        { name: 'Toulon', country: 'France', countryCode: 'FR', state: 'Provence-Alpes-Côte d\'Azur' }
      ],
      'AU': [
        { name: 'Sydney', country: 'Australia', countryCode: 'AU', state: 'NSW' },
        { name: 'Melbourne', country: 'Australia', countryCode: 'AU', state: 'VIC' },
        { name: 'Brisbane', country: 'Australia', countryCode: 'AU', state: 'QLD' },
        { name: 'Perth', country: 'Australia', countryCode: 'AU', state: 'WA' },
        { name: 'Adelaide', country: 'Australia', countryCode: 'AU', state: 'SA' },
        { name: 'Gold Coast', country: 'Australia', countryCode: 'AU', state: 'QLD' },
        { name: 'Newcastle', country: 'Australia', countryCode: 'AU', state: 'NSW' },
        { name: 'Canberra', country: 'Australia', countryCode: 'AU', state: 'ACT' },
        { name: 'Wollongong', country: 'Australia', countryCode: 'AU', state: 'NSW' },
        { name: 'Hobart', country: 'Australia', countryCode: 'AU', state: 'TAS' },
        { name: 'Geelong', country: 'Australia', countryCode: 'AU', state: 'VIC' },
        { name: 'Townsville', country: 'Australia', countryCode: 'AU', state: 'QLD' },
        { name: 'Cairns', country: 'Australia', countryCode: 'AU', state: 'QLD' },
        { name: 'Darwin', country: 'Australia', countryCode: 'AU', state: 'NT' },
        { name: 'Toowoomba', country: 'Australia', countryCode: 'AU', state: 'QLD' }
      ]
    }

    return mockCities[countryCode] || []
  }

  async getCities(countryCode: string, query?: string): Promise<City[]> {
    // Check cache first
    const cacheKey = `${countryCode}-${query || 'all'}`
    if (this.citiesCache.has(cacheKey)) {
      return this.citiesCache.get(cacheKey)!
    }

    try {
      // In production, replace this with a real API call
      // Example: const response = await fetch(`/api/cities?country=${countryCode}&q=${query}`)
      
      let cities = this.getMockCities(countryCode)
      
      // Filter by query if provided
      if (query) {
        cities = cities.filter(city => 
          city.name.toLowerCase().includes(query.toLowerCase())
        )
      }

      // Cache the result
      this.citiesCache.set(cacheKey, cities)
      
      return cities
    } catch (error) {
      console.error('Error fetching cities:', error)
      return []
    }
  }

  async searchCities(query: string, countryCode?: string): Promise<City[]> {
    if (!query || query.length < 2) {
      return []
    }

    try {
      // If country is specified, search within that country
      if (countryCode) {
        const cities = await this.getCities(countryCode, query)
        return cities
      }

      // Otherwise, search across all countries (limited for performance)
      const allCities: City[] = []
      const countriesToSearch = ['US', 'CA', 'GB', 'DE', 'FR', 'AU'] // Limit to major countries
      
      for (const country of countriesToSearch) {
        const cities = await this.getCities(country, query)
        allCities.push(...cities)
      }

      return allCities.slice(0, 50) // Limit results
    } catch (error) {
      console.error('Error searching cities:', error)
      return []
    }
  }

  formatCityDisplay(city: City): string {
    if (city.state) {
      return `${city.name}, ${city.state}, ${city.country}`
    }
    return `${city.name}, ${city.country}`
  }
}

// Export singleton instance
export const locationService = new LocationService()