const getNotificationStatus = (item) => {
    if(item.dateCompleted)
    {
        return 'Completed';
    } else if(item.dateStarted) {
        return 'Started';
    } else if (item.dateSent) {
        if(getMinutesBetweenDates(item.dateSent, new Date()) < 5)
        {
            return 'Just Sent';
        }
        return 'Late';
    }
}
const getMinutesBetweenDates = (startDate, endDate) => {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
  }
export default getNotificationStatus;