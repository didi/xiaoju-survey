package com.xiaojusurvey.engine.controller;

import com.alibaba.fastjson.JSON;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.user.UserService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Test
    public void testFindAllUser() {
        Mockito.when(userService.findAllUser()).thenReturn(null);
        RpcResult<List<User>> result = userController.findAllUser();
        Assert.assertTrue(result.getSuccess());
        Assert.assertEquals(new Integer(200), result.getCode());
        List<User> userList = new ArrayList<>();
        User user = new User();
        user.setPassword("1111");
        user.setUsername("tom");
        userList.add(user);
        Mockito.when(userService.findAllUser()).thenReturn(userList);
        result = userController.findAllUser();
        System.out.println( JSON.toJSONString(result));
        Assert.assertEquals(1, result.getData().size());
        Assert.assertEquals("1111", result.getData().get(0).getPassword());
        Assert.assertEquals("tom", result.getData().get(0).getUsername());
    }
}
