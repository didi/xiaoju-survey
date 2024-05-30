import { splitMembers, Member } from '../utils/splitMember';
import { ROLE as WORKSPACE_ROLE } from 'src/enums/workspace';

describe('splitMembers', () => {
  it('should split members into newMembers, adminMembers, and userMembers', () => {
    const members = [
      { userId: 'user1', role: WORKSPACE_ROLE.ADMIN, _id: '1' },
      { userId: 'user2', role: WORKSPACE_ROLE.USER, _id: '2' },
      { userId: 'user3', role: WORKSPACE_ROLE.ADMIN, _id: '3' },
      { userId: 'user4', role: WORKSPACE_ROLE.USER, _id: '4' },
      { userId: 'user5', role: WORKSPACE_ROLE.USER },
    ];

    const result = splitMembers(members);

    expect(result).toEqual({
      newMembers: [{ userId: 'user5', role: WORKSPACE_ROLE.USER }],
      adminMembers: ['1', '3'],
      userMembers: ['2', '4'],
    });
  });

  it('should handle an empty members array', () => {
    const members: Array<Member> = [];

    const result = splitMembers(members);

    expect(result).toEqual({
      newMembers: [],
      adminMembers: [],
      userMembers: [],
    });
  });

  it('should handle members with no role', () => {
    const members = [
      { userId: 'user1', role: WORKSPACE_ROLE.ADMIN, _id: '1' },
      { userId: 'user2', role: '', _id: '2' },
      { userId: 'user3', role: '', _id: '3' },
    ];

    const result = splitMembers(members);

    expect(result).toEqual({
      newMembers: [],
      adminMembers: ['1'],
      userMembers: ['2', '3'],
    });
  });
});
