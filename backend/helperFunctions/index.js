const cleanDate = (dateString) => {
    const regex = /(\d{2})\s([A-Z]{3})\s\/\s([A-Z]{3})\s(\d{2})/;
    const match = dateString.match(regex);
    if (match) {
        const [, day, month, monthAgain, year] = match;
        return `${day} ${month} / ${monthAgain} ${year}`;
    }
    return dateString;  
  };

   const cleanField = (value) => {
    return value.replace(/[^A-Z0-9\s]/g, '').trim(); 
  }

  module.exports = {
    cleanDate, cleanField
  }