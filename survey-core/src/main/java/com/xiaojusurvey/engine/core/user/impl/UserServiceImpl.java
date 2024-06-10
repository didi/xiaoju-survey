package com.xiaojusurvey.engine.core.user.impl;

import com.xiaojusurvey.engine.common.constants.RespErrorCode;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.exception.ServiceException;
import com.xiaojusurvey.engine.core.auth.util.AuthUtil;
import com.xiaojusurvey.engine.core.user.UserService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.List;

@Service("userService")
public class UserServiceImpl implements UserService {

    @Resource
    private MongoRepository mongoRepository;

    public List<User> findAllUser() {
        return mongoRepository.findAll(User.class);
    }


    /**
     * 查询用户
     *
     * @param username
     * @param password
     * @return
     */
    @Override
    public User loadUserByUsernameAndPassword(String username, String password) {
        Query query = new Query();
        String encryptPassword = AuthUtil.encryptPassword(password, username);
        query.addCriteria(Criteria.where("username").is(username).and("password").is(encryptPassword));
        //查询用户并返回
        User user = mongoRepository.findOne(query, User.class);
        if (ObjectUtils.isEmpty(user)) {
            throw new ServiceException(RespErrorCode.USER_PASSWORD_ERROR.getMessage(), RespErrorCode.USER_PASSWORD_ERROR.getCode());
        }
        return user;
    }
}
