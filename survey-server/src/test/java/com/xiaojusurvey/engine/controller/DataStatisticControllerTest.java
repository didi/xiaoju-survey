package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.core.survey.DataStatisticService;
import com.xiaojusurvey.engine.core.survey.param.DataTableParam;
import com.xiaojusurvey.engine.core.survey.vo.DataTableVO;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.*;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/16
 * @Description: DataStatisticController单元测试
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class DataStatisticControllerTest {

    @InjectMocks
    private DataStatisticController dataStatisticController;

    @Mock
    private DataStatisticService dataStatisticService;

    private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private final Validator validator = factory.getValidator();

    @Test
    public void testGetDataTable_Success() {
        // 准备测试数据
        DataTableParam param = new DataTableParam();
        param.setSurveyId("test-survey-id");
        param.setPage(1);
        param.setPageSize(10);
        param.setIsMasked(false);

        // Mock返回数据
        DataTableVO mockResult = createMockDataTableVO();
        Mockito.when(dataStatisticService.getDataTable(param)).thenReturn(mockResult);

        // 执行测试
        RpcResult<DataTableVO> result = dataStatisticController.getDataTable(param);

        // 验证结果
        Assert.assertTrue("结果应该成功", result.getSuccess());
        Assert.assertEquals("响应码应该是200", Integer.valueOf(200), result.getCode());
        Assert.assertNotNull("数据不应该为空", result.getData());
        Assert.assertEquals("总数应该匹配", Long.valueOf(10), result.getData().getTotal());
        Assert.assertEquals("表头数量应该匹配", 3, result.getData().getListHead().size());
        Assert.assertEquals("数据行数量应该匹配", 2, result.getData().getListBody().size());
    }

    @Test
    public void testGetDataTable_WithMasking() {
        // 准备测试数据
        DataTableParam param = new DataTableParam();
        param.setSurveyId("test-survey-id");
        param.setPage(1);
        param.setPageSize(10);
        param.setIsMasked(true); // 开启脱敏

        // Mock返回数据
        DataTableVO mockResult = createMockDataTableVOWithSensitiveData();
        Mockito.when(dataStatisticService.getDataTable(param)).thenReturn(mockResult);

        // 执行测试
        RpcResult<DataTableVO> result = dataStatisticController.getDataTable(param);

        // 验证结果
        Assert.assertTrue("结果应该成功", result.getSuccess());
        Assert.assertEquals("响应码应该是200", Integer.valueOf(200), result.getCode());
        Assert.assertNotNull("数据不应该为空", result.getData());

        // 验证脱敏数据
        Map<String, Object> firstRow = result.getData().getListBody().get(0);
        String phoneNumber = (String) firstRow.get("data123");
        Assert.assertTrue("手机号应该被脱敏", phoneNumber.contains("****"));
    }

    @Test
    public void testGetDataTable_ValidationFails() {
        // 准备无效参数
        DataTableParam param = new DataTableParam();
        param.setSurveyId(""); // 空的surveyId应该验证失败
        param.setPage(0); // 无效的页码
        param.setPageSize(-1); // 无效的页大小

        // 执行验证
        Set<ConstraintViolation<DataTableParam>> violations = validator.validate(param);

        // 验证结果
        Assert.assertFalse("应该有验证错误", violations.isEmpty());
        Assert.assertTrue("应该包含surveyId验证错误",
                violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("surveyId")));
        Assert.assertTrue("应该包含page验证错误",
                violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("page")));
        Assert.assertTrue("应该包含pageSize验证错误",
                violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("pageSize")));
    }

    @Test
    public void testGetDataTable_EmptyResult() {
        // 准备测试数据
        DataTableParam param = new DataTableParam();
        param.setSurveyId("empty-survey-id");
        param.setPage(1);
        param.setPageSize(10);
        param.setIsMasked(false);

        // Mock空结果
        DataTableVO emptyResult = new DataTableVO();
        emptyResult.setTotal(0L);
        emptyResult.setListHead(new ArrayList<>());
        emptyResult.setListBody(new ArrayList<>());

        Mockito.when(dataStatisticService.getDataTable(param)).thenReturn(emptyResult);

        // 执行测试
        RpcResult<DataTableVO> result = dataStatisticController.getDataTable(param);

        // 验证结果
        Assert.assertTrue("结果应该成功", result.getSuccess());
        Assert.assertEquals("响应码应该是200", Integer.valueOf(200), result.getCode());
        Assert.assertNotNull("数据不应该为空", result.getData());
        Assert.assertEquals("总数应该为0", Long.valueOf(0), result.getData().getTotal());
        Assert.assertTrue("表头应该为空", result.getData().getListHead().isEmpty());
        Assert.assertTrue("数据行应该为空", result.getData().getListBody().isEmpty());
    }

    @Test
    public void testGetDataTable_ServiceException() {
        // 准备测试数据
        DataTableParam param = new DataTableParam();
        param.setSurveyId("test-survey-id");
        param.setPage(1);
        param.setPageSize(10);
        param.setIsMasked(false);

        // Mock服务层异常
        Mockito.when(dataStatisticService.getDataTable(param))
                .thenThrow(new RuntimeException("服务异常"));

        // 执行测试并验证异常
        try {
            dataStatisticController.getDataTable(param);
            Assert.fail("应该抛出异常");
        } catch (RuntimeException e) {
            Assert.assertEquals("异常信息应该匹配", "服务异常", e.getMessage());
        }
    }

    /**
     * 创建Mock数据表格VO
     */
    private DataTableVO createMockDataTableVO() {
        DataTableVO dataTableVO = new DataTableVO();
        dataTableVO.setTotal(10L);

        // 表头数据
        List<DataTableVO.ListHeadItem> listHead = Arrays.asList(
                createListHeadItem("data1", "姓名", "text"),
                createListHeadItem("data2", "年龄", "radio"),
                createListHeadItem("diffTime", "答题时长(秒)", "system")
        );
        dataTableVO.setListHead(listHead);

        // 数据行
        List<Map<String, Object>> listBody = Arrays.asList(
                createDataRow("张三", "25岁", "45.20", "2024-01-01 10:00:00"),
                createDataRow("李四", "30岁", "52.10", "2024-01-01 11:00:00")
        );
        dataTableVO.setListBody(listBody);

        return dataTableVO;
    }

    /**
     * 创建包含敏感数据的Mock数据表格VO
     */
    private DataTableVO createMockDataTableVOWithSensitiveData() {
        DataTableVO dataTableVO = new DataTableVO();
        dataTableVO.setTotal(5L);

        // 表头数据
        List<DataTableVO.ListHeadItem> listHead = Arrays.asList(
                createListHeadItem("data123", "手机号", "text"),
                createListHeadItem("data456", "身份证", "text")
        );
        dataTableVO.setListHead(listHead);

        // 数据行（已脱敏）
        List<Map<String, Object>> listBody = Arrays.asList(
                createSensitiveDataRow("152****0000", "330123********1234")
        );
        dataTableVO.setListBody(listBody);

        return dataTableVO;
    }

    private DataTableVO.ListHeadItem createListHeadItem(String field, String title, String type) {
        DataTableVO.ListHeadItem item = new DataTableVO.ListHeadItem();
        item.setField(field);
        item.setTitle(title);
        item.setType(type);
        return item;
    }

    private Map<String, Object> createDataRow(String name, String age, String diffTime, String createdAt) {
        Map<String, Object> row = new HashMap<>();
        row.put("data1", name);
        row.put("data2", age);
        row.put("diffTime", diffTime);
        row.put("createdAt", createdAt);
        return row;
    }

    private Map<String, Object> createSensitiveDataRow(String phone, String idCard) {
        Map<String, Object> row = new HashMap<>();
        row.put("data123", phone);
        row.put("data456", idCard);
        return row;
    }
}
