export const generateAvailability = () => {
  const availability = [];
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate(); //month + 1 kyuknki months ka index 0 se hai 

  for (let i = 0; i < daysInMonth; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    availability.push({
      date: futureDate.toISOString().split('T')[0],
      available: true, 
    });
  }

  return availability;
};
