let count = 999;

const getCountStr = () => {
  count++;
  if (count > 9000) {
    count = 1000;
  }
  return count.toString();
};

export const genTraceId = ({ ip }) => {
  // ip转16位 + 当前时间戳（毫秒级）+自增序列（1000开始自增到9000）+ 当前进程id的后5位
  ip = ip.replace('::ffff:', '').replace('::1', '');
  let ipArr;
  if (ip.indexOf(':') >= 0) {
    ipArr = ip.split(':').map((segment) => {
      // 将IPv6每个段转为16位，并补0到长度为4
      return parseInt(segment, 16).toString(16).padStart(4, '0');
    });
  } else {
    ipArr = ip
      .split('.')
      .map((item) =>
        item ? parseInt(item).toString(16).padStart(2, '0') : '',
      );
  }

  return `${ipArr.join('')}${Date.now().toString()}${getCountStr()}${process.pid.toString().slice(-5)}`;
};
