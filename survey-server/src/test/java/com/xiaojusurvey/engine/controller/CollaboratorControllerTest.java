package com.xiaojusurvey.engine.controller;

import com.alibaba.fastjson.JSONArray;
import com.xiaojusurvey.engine.common.entity.user.User;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;

@RunWith(SpringJUnit4ClassRunner.class)
public class CollaboratorControllerTest {
    @InjectMocks
    CollaboratorController collaboratorController;

    private HttpServletRequest httpServletRequest;

    @Before
    public void initBean() {
        httpServletRequest = new MockHttpServletRequest();
        User user = new User();
        user.setId("123");
        user.setUsername("maple");
        httpServletRequest.setAttribute("user", user);
    }

    @Test
    public void getPermissionList() {
        RpcResult<JSONArray> permissionListResult = collaboratorController.getPermissionList();
        Assert.assertTrue(permissionListResult.getSuccess());
        Assert.assertEquals(new Integer(200), permissionListResult.getCode());
    }
}
