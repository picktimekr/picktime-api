import sequelize from '../utils/database';

import User from './user.model';
import School from './school.model';
import Teacher from './teacher.model';
import Subject from './subject.model';
import Period from './period.model';
import Timetable from './timetable.model';

// 향후 모델 간 관계(association) 설정이 필요할 경우 이 파일에서 처리하면 좋습니다.

// 모든 모델을 이 파일 하나를 통해 가져올 수 있도록 export 합니다.
export {
  sequelize,
  User,
  School,
  Teacher,
  Subject,
  Period,
  Timetable,
};
