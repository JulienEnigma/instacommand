
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-red-600 animate-pulse';
    case 'completed': return 'bg-green-600';
    case 'scheduled': return 'bg-yellow-600';
    case 'failed': return 'bg-gray-600';
    case 'archived': return 'bg-blue-600/50';
    case 'paused': return 'bg-orange-600';
    default: return 'bg-gray-600';
  }
};

export const generateVerdict = () => {
  const verdicts = [
    'Excellent follow-back rate. Recommend expanding target pool.',
    'Great conversion. Suggest reusing comment strategy.',
    'Strong engagement. Consider similar demographics.',
    'Outstanding results. Strategy validated for replication.'
  ];
  
  return verdicts[Math.floor(Math.random() * verdicts.length)];
};
