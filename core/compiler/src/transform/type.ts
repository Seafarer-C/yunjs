// 副作用
export interface EffectHandle {
  // 数据作用的 dom 节点的 yun-id
  yun_id: string;
  // 影响的 attribute
  attribute?: string;
}
// 事件
export interface EventHandle {
  // 数据作用的 dom 节点的 yun-id
  yun_id: string;
  // 事件
  event_name?: string;
  // 参数
  params?: Array<any>;
}
