package com.xiaojusurvey.engine.core.user.impl;

import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.core.user.UserService;
import com.xiaojusurvey.engine.repository.MongoRepository;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service("userService")
public class UserServiceImpl implements UserService, UserDetailsService {

    @Resource
    private MongoRepository mongoRepository;

    public List<User> findAllUser() {
        return mongoRepository.findAll(User.class);
    }


    @Override
    public UserDetails loadUserByUsername(String username) {
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(username));
        //查询用户并返回
        return mongoRepository.findOne(query, User.class);
    }
}
