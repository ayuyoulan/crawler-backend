## 功能要求

### 已达到

- 从 [etherscan](https://etherscan.io/) 上抓取并返回给定账户的交易历史，源数据页面见：https://etherscan.io/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90 (如果网络有问题可以使用备用站点: https://cn.etherscan.com/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90 或https://blockscan.com/address/0xeb2a81e229b68c1c22b6683275c00945f9872d90)
- 开发路由为 /api/txs?a={address} 的 API，请求样例 /api/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90
- API 能返回原数据页面中表格的各个字段，比如 txHash、BlockNumber、Time、From、To、Value、TxFee，且应该支持自定义分页
- API 不要只支持查询某个特定的账户，而是可以输入任意账户地址来查询交易历史
- API 要尽可能的缓存数据，以加快访问速度

### 未达到

业务场景 1.本地数据表已有目标 address 的数据时，在对应网站指定address进行去重更新本地表；

业务场景 2.若已针对指定 address 爬取数据并正在进行时，新的请求已经对二次爬虫作校验排斥再次执行；

## 技术要求

- 最终提交的代码应该是一个 Blocklet, 可以打包、部署，并运行在 Blocklet Server 中。
- 应该编写测试，并且测试能全部通过，测试不限于单元测试和 E2E 测试
- API 对输入参数的边界处理，错误处理要合理

## License

The code is licensed under the Apache 2.0 license found in the
[LICENSE](LICENSE) file.
