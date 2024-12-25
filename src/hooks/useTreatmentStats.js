export function useTreatmentStats(appointments) {
  return useMemo(() => {
    const stats = {};
    appointments.forEach(apt => {
      if (!stats[apt.treatment]) {
        stats[apt.treatment] = {
          count: 0,
          totalDuration: 0,
          averageDuration: 0
        };
      }
      stats[apt.treatment].count++;
      stats[apt.treatment].totalDuration += TREATMENT_DURATIONS[apt.treatment];
      stats[apt.treatment].averageDuration = 
        stats[apt.treatment].totalDuration / stats[apt.treatment].count;
    });
    return stats;
  }, [appointments]);
} 