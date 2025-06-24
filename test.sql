<!-- 原始版本，只包含回收数 -->
select 
    recover_dt,
    deptDescr1,
    count(*) as cnt
from
(
    SELECT 
        dt as recover_dt,
        get_json_object(mongodb_column,'$.activityName') as wj_id
    FROM fe_bi.ods_questionregister_sync
    WHERE 
        dt BETWEEN '2023-01-01' AND '$[YYYY-MM-DD - 2D]'

    UNION ALL

    SELECT 
        dt as recover_dt,
        get_json_object(mongodb_column,'$.activityName') as wj_id
    FROM fe_bi.ods_questionregister_daijia
    WHERE
        dt BETWEEN '2023-01-01' AND '$[YYYY-MM-DD - 2D]'
) recover
inner join 
(
    select *
    from fe_bi.wjOwnerDept
    where 
        dt = '$[YYYY-MM-DD - 2D]'
        
) t5
on recover.wj_id = t5.wj_id
group by recover_dt,deptDescr1;


版本1：
SELECT 
    DATE_FORMAT(createData, '%Y-%m-%d') as recover_dt,
    wj_id,
    COUNT(*) as daily_count
FROM (
    -- 第一张表：按dt分区，只包含当日回收数
    SELECT 
        get_json_object(mongodb_column,'$.createData') as createData,
        get_json_object(mongodb_column,'$.activityName') as wj_id
    FROM fe_bi.ods_questionregister_sync
    WHERE 
        dt BETWEEN '2023-01-01' AND '$[YYYY-MM-DD - 1D]'
        AND get_json_object(mongodb_column,'$.createData') IS NOT NULL
        -- and get_json_object(mongodb_column,'$.activityName') != 'ddpage_0IvmV4e2'

    UNION ALL

    -- 第二张表：按dt分区，包含全部回收数，需要按createData过滤
    SELECT 
        get_json_object(mongodb_column,'$.createData') as createData,
        get_json_object(mongodb_column,'$.activityName') as wj_id
    FROM fe_fe_bi.ods_questionregister_daijia
    WHERE 
        dt = '$[YYYY-MM-DD - 2D]'
        AND get_json_object(mongodb_column,'$.createData') IS NOT NULL
        AND DATE_FORMAT(get_json_object(mongodb_column,'$.createData'), '%Y-%m-%d') = dt
        -- and get_json_object(mongodb_column,'$.activityName') != 'ddpage_0IvmV4e2'
) combined_data
GROUP BY DATE_FORMAT(createData, '%Y-%m-%d'), wj_id
ORDER BY recover_dt, wj_id


版本2：
WITH sync_data AS (
    -- 第一张表：按dt分区，只包含当日回收数
    SELECT 
        dt as recover_dt,
        get_json_object(mongodb_column,'$.activityName') as wj_id,
        COUNT(*) as sync_count
    FROM fe_bi.ods_questionregister_sync
    WHERE 
        dt BETWEEN '2023-01-01' AND '$[YYYY-MM-DD - 1D]'
        -- and get_json_object(mongodb_column,'$.activityName') != 'ddpage_0IvmV4e2'
    GROUP BY dt, get_json_object(mongodb_column,'$.activityName')
),
daijia_data AS (
    -- 第二张表：按createData分组，包含全部回收数
    SELECT 
        DATE_FORMAT(get_json_object(mongodb_column,'$.createData'), '%Y-%m-%d') as recover_dt,
        get_json_object(mongodb_column,'$.activityName') as wj_id,
        COUNT(*) as daijia_count
    FROM fe_bi.ods_questionregister_daijia
    WHERE 
        dt BETWEEN '2023-01-01' AND '$[YYYY-MM-DD - 1D]'
        AND get_json_object(mongodb_column,'$.createData') IS NOT NULL
        -- and get_json_object(mongodb_column,'$.activityName') != 'ddpage_0IvmV4e2'
    GROUP BY DATE_FORMAT(get_json_object(mongodb_column,'$.createData'), '%Y-%m-%d'), 
             get_json_object(mongodb_column,'$.activityName')
)
SELECT 
    COALESCE(s.recover_dt, d.recover_dt) as recover_dt,
    COALESCE(s.wj_id, d.wj_id) as wj_id,
    COALESCE(s.sync_count, 0) as sync_count,
    COALESCE(d.daijia_count, 0) as daijia_count,
    COALESCE(s.sync_count, 0) + COALESCE(d.daijia_count, 0) as total_count
FROM sync_data s
FULL OUTER JOIN daijia_data d ON s.recover_dt = d.recover_dt AND s.wj_id = d.wj_id
ORDER BY recover_dt, wj_id