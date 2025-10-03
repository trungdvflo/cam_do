
module.exports = class actionList {
	constructor(a) {
		this.action = [];
// -- REPORT SECTION ----- BAO CAO TAI CHINH ----- 101 101 1xxx
		this.action['Report'] = [];
		this.action['Report']['Financial'] = [];
		this.action['Report']['Financial'][1011011001] = {
			'id'	: '1011011001',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 1',
			'name' 	: 'Chi tiết doanh thu',
			'url'	: "Report09"
		}
		this.action['Report']['Financial'][1011011047] = {
			'id'	: '1011011047',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu chưa có',
			'name' 	: 'Lịch sử giao dịch ngân hàng Phương Nam',
			'url'	: "Report105"
		}
		
		this.action['Report']['Financial'][1011011002] = {
			'id'	: '1011011002',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 2',
			'name' 	: 'Doanh thu theo thu ngân',
			'url'	: "Report49', 2)"
		}
		
		this.action['Report']['Financial'][1011011003] = {
			'id'	: '1011011003',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 3',
			'name' 	: 'Tổng hợp doanh thu theo thu ngân',
			'url'	: "Report56"
		}

		this.action['Report']['Financial'][1011011004] = {
			'id'	: '1011011004',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 5.1',
			'name' 	: 'Doanh thu theo bác sĩ (Hóa đơn)',
			'url'	: "Report51"
		}
		
		this.action['Report']['Financial'][1011011005] = {
			'id'	: '1011011005',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 5.2',
			'name' 	: 'Doanh thu theo bác sĩ (chi tiết dịch vụ)',
			'url'	: "Report54"
		}
		
		this.action['Report']['Financial'][1011011006] = {
			'id'	: '1011011006',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 6.1',
			'name' 	: 'Doanh thu theo dịch vụ',
			'url'	: "Report10"
		}
		
		this.action['Report']['Financial'][1011011007] = {
			'id'	: '1011011007',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 6.2',
			'name' 	: 'Thông tin bệnh nhân theo dịch vụ',
			'url'	: "Report58', 1)"
		}
		
		this.action['Report']['Financial'][1011011008] = {
			'id'	: '1011011008',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 9',
			'name' 	: 'Doanh thu bán thuốc theo toa BS',
			'url'	: "Report63', 1)"
		}
		
		this.action['Report']['Financial'][1011011009] = {
			'id'	: '1011011009',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 10',
			'name' 	: 'Thống kê thuốc được bán theo toa BS',
			'url'	: "Report66"
		}
		
		this.action['Report']['Financial'][1011011010] = {
			'id'	: '1011011010',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 11',
			'name' 	: 'Danh sách bệnh nhân có phiếu hoàn tiền',
			'url'	: "Report61"
		}
		
		this.action['Report']['Financial'][1011011011] = {
			'id'	: '1011011011',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 12',
			'name' 	: 'Thanh toán bhyt ngoại trú',
			'url'	: "Report70', 2)"
		}
		
		this.action['Report']['InsuranceReport'] = [];
		this.action['Report']['InsuranceReport'][1011011012] = {
			'id'	: '1011011012',
			'type'  : 'BHYT',
			'order' : 'Biểu 15',
			'name' 	: 'Danh sách đề nghị thanh toán chi phí KCB ngoại trú (mẫu C79a-HD)',
			'url'	: "Report14', 2)"
		}
		
		this.action['Report']['InsuranceReport'][1011011013] = {
			'id'	: '1011011013',
			'type'  : 'BHYT',
			'order' : 'Biểu 16',
			'name' 	: 'Tổng hợp chi phí KCB BHYT ngoại trú (mẫu 25a-TH)',
			'url'	: "Report16', 2)"
		}
		
		this.action['Report']['Financial'][1011011014] = {
			'id'	: '1011011014',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 17',
			'name' 	: 'Chi tiết dịch vụ theo bệnh nhân',
			'url'	: "Report77"
		}
		
		this.action['Report']['Financial'][1011011015] = {
			'id'	: '1011011015',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 18',
			'name' 	: 'Danh sách bệnh nhân tiêu nhiều tiền',
			'url'	: "Report79"
		}
		
		this.action['Report']['Financial'][1011011016] = {
			'id'	: '1011011016',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 19',
			'name' 	: 'Danh sách bệnh nhân tái khám nhiều lần',
			'url'	: "Report80"
		}
		
		this.action['Report']['Financial'][1011011018] = {
			'id'	: '1011011018',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 21',
			'name' 	: 'Phiếu công khai thuốc, vật tư y tế',
			'url'	: "Report84"
		}
		
		this.action['Report']['InsuranceReport'][1011011019] = {
			'id'	: '1011011019',
			'type'  : 'BHYT',
			'order' : 'Biểu 22',
			'name' 	: 'Thống kê tổng hợp dịch vụ(Mẫu:21/bhyt)',
			'url'	: "Report85"
		}
		
		this.action['Report']['Financial'][1011011020] = {
			'id'	: '1011011020',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 23',
			'name' 	: 'Báo cáo gói khám',
			'url'	: "Report83"
		}
		
		this.action['Report']['Financial'][1011011021] = {
			'id'	: '1011011021',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 24',
			'name' 	: 'Báo cáo thuốc đông y',
			'url'	: "Report88"
		}
		
		this.action['Report']['Financial'][1011011022] = {
			'id'	: '1011011022',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 25',
			'name' 	: 'Báo cáo bệnh nhân có toa thuốc đông y',
			'url'	: "Report89"
		}
		
		this.action['Report']['Financial'][1011011023] = {
			'id'	: '1011011023',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 26',
			'name' 	: 'Báo cáo dịch vụ XN ngoại trú',
			'url'	: "Report90"
		}
		
		this.action['Report']['Financial'][1011011024] = {
			'id'	: '1011011024',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 26.1',
			'name' 	: 'Báo cáo chi tiết dịch vụ XN ngoại trú',
			'url'	: "Report92"
		}
		
		this.action['Report']['Financial'][1011011025] = {
			'id'	: '1011011025',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 27',
			'name' 	: 'Báo cáo doanh thu quầy thuốc',
			'url'	: "DstReport14"
		}
		
		// new 10/03/2014
		this.action['Report']['Financial'][102109106] = {
				'id'	: '1021091006',
				'type'  : 'Ngoại trú',
				'order' : 'Biểu 28',
				'name' 	: 'Thống kê BHBL ngoại trú & nội trú',
				'url'	: "Report103"
		}
		
		this.action['Report']['Financial'][1011011026] = {
			'id'	: '1011011026',
			'type'  : 'Nội trú',
			'order' : 'Biểu 1',
			'name' 	: 'Chi tiết doanh thu',
			'url'	: "Report46"
		}
		
		this.action['Report']['Financial'][1011011027] = {
			'id'	: '1011011027',
			'type'  : 'Nội trú',
			'order' : 'Biểu 2',
			'name' 	: 'Doanh thu theo thu ngân',
			'url'	: "Report55"
		}
		
		this.action['Report']['Financial'][1011011028] = {
			'id'	: '1011011028',
			'type'  : 'Nội trú',
			'order' : 'Biểu 3',
			'name' 	: 'Tổng hợp doanh thu theo thu ngân',
			'url'	: "Report56"
		}
		
		this.action['Report']['Financial'][1011011029] = {
			'id'	: '1011011029',
			'type'  : 'Nội trú',
			'order' : 'Biểu 5',
			'name' 	: 'Doanh thu phẫu thuật, khấu hao, vô cảm',
			'url'	: "Report53"
		}
		
		this.action['Report']['Financial'][1011011030] = {
			'id'	: '1011011030',
			'type'  : 'Nội trú',
			'order' : 'Biểu 6.1',
			'name' 	: 'Doanh thu theo dịch vụ',
			'url'	: "Report64', 1)"
		}
		
		this.action['Report']['Financial'][1011011031] = {
			'id'	: '1011011031',
			'type'  : 'Nội trú',
			'order' : 'Biểu 6.2',
			'name' 	: 'Doanh thu theo dịch vụ (theo bác sĩ)',
			'url'	: "Report76', 1)"
		}
		
		this.action['Report']['Financial'][1011011032] = {
			'id'	: '1011011032',
			'type'  : 'Nội trú',
			'order' : 'Biểu 7',
			'name' 	: 'Thông tin bệnh nhân theo dịch vụ',
			'url'	: "Report59', 1)"
		}
		
		/*this.action['Report']['Financial'][1011011033] = {
			'id'	: '1011011033',
			'type'  : 'Nội trú',
			'order' : 'Biểu 8',
			'name' 	: 'Doanh thu theo khoa',
			'url'	: "Report60', 1)"
		}*/
		
		this.action['Report']['Financial'][1011011034] = {
			'id'	: '1011011034',
			'type'  : 'Nội trú',
			'order' : 'Biểu 8',
			'name' 	: 'Doanh thu theo khoa',
			'url'	: "Report95', 1)"
		}
		
		this.action['Report']['Financial'][1011011035] = {
			'id'	: '1011011035',
			'type'  : 'Nội trú',
			'order' : 'Biểu 9',
			'name' 	: 'Thông tin thu tạm ứng',
			'url'	: "Report65', 1)"
		}
		
		this.action['Report']['Financial'][1011011036] = {
			'id'	: '1011011036',
			'type'  : 'Nội trú',
			'order' : 'Biểu 10',
			'name' 	: 'Thông tin bảo hiểm bảo lãnh',
			'url'	: "Report67', 1)"
		}
		
		this.action['Report']['Financial'][1011011037] = {
			'id'	: '1011011037',
			'type'  : 'Nội trú',
			'order' : 'Biểu 11',
			'name' 	: 'Thông tin thu bảo hiểm bảo lãnh',
			'url'	: "Report87', 1)"
		}
		
		this.action['Report']['Financial'][1011011038] = {
			'id'	: '1011011038',
			'type'  : 'Nội trú',
			'order' : 'Biểu 12',
			'name' 	: 'Thanh toán bhyt nội trú',
			'url'	: "Report70', 1)"
		}
		
		this.action['Report']['InsuranceReport'][1011011039] = {
			'id'	: '1011011039',
			'type'  : 'BHYT',
			'order' : 'Biểu 13',
			'name' 	: 'Danh sách người bệnh BHYT KCB nội trú đề nghị thanh toán (mẫu C80a-HD)',
			'url'	: "Report15', 1)"
		}
		
		this.action['Report']['InsuranceReport'][1011011040] = {
			'id'	: '1011011040',
			'type'  : 'BHYT',
			'order' : 'Biểu 15',
			'name' 	: 'Số liệu đề nghị thanh toán chi phí KCB nội trú',
			'url'	: "Report17', 2)"
		}
		
		this.action['Report']['Financial'][1011011041] = {
			'id'	: '1011011041',
			'type'  : 'Nội trú',
			'order' : 'Biểu 16',
			'name' 	: 'Báo cáo dịch vụ XN',
			'url'	: "Report73', 2)"
		}
		
		this.action['Report']['Financial'][1011011042] = {
			'id'	: '1011011042',
			'type'  : 'Nội trú',
			'order' : 'Biểu 16.1',
			'name' 	: 'Báo cáo chi tiết dịch vụ XN nội trú',
			'url'	: "Report91', 2)"
		}
		
		this.action['Report']['Financial'][1011011043] = {
			'id'	: '1011011043',
			'type'  : 'Nội trú',
			'order' : 'Biểu 17',
			'name' 	: 'Danh sách bệnh nhân có phiếu hoàn tiền',
			'url'	: "Report74"
		}
		
		this.action['Report']['Financial'][1011011044] = {
			'id'	: '1011011044',
			'type'  : 'Nội trú',
			'order' : 'Biểu 18',
			'name' 	: 'Chi tiết dịch vụ theo bệnh nhân',
			'url'	: "Report78"
		}
		
		this.action['Report']['Financial'][1011011045] = {
			'id'	: '1011011045',
			'type'  : 'Nội trú',
			'order' : 'Biểu 18M',
			'name' 	: 'Chi tiết dịch vụ theo bệnh nhân (Mới)',
			'url'	: "Report96"
		}
		
		this.action['Report']['Financial'][1011011046] = {
			'id'	: '1011011046',
			'type'  : 'Nội trú',
			'order' : 'Biểu 19',
			'name' 	: 'Doanh thu giường',
			'url'	: "Report94"
		}
		
// -- REPORT SECTION ----- BAO CAO HOAT DONG ----- 101 102 1xxx
		this.action['Report']['Operation'] = [];
		this.action['Report']['Operation'][1011021001] = {
			'id'	: '1011021001',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 1.1',
			'name' 	: 'Danh sách bệnh nhân ngoại trú (Viện phí)',
			'url'	: "Report31"
		}
		
		this.action['Report']['Operation'][1011021002] = {
			'id'	: '1011021002',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 1.2',
			'name' 	: 'Danh sách bệnh nhân ngoại trú (Hành chính)',
			'url'	: "Report50"
		}
		
		this.action['Report']['Operation'][1011021003] = {
			'id'	: '1011021003',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 2.1',
			'name' 	: 'Tình hình khám bệnh theo bác sĩ',
			'url'	: "Report52"
		}
		
		this.action['Report']['Operation'][1011021004] = {
			'id'	: '1011021004',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 2.2',
			'name' 	: 'Danh sách khám bệnh theo bác sĩ',
			'url'	: "Report69"
		}
		
		this.action['Report']['Operation'][1011021005] = {
			'id'	: '1011021005',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 2.3',
			'name' 	: 'Chi tiết phân loại khám bệnh theo bác sĩ',
			'url'	: "Report72"
		}
		
		this.action['Report']['Operation'][1011021006] = {
			'id'	: '1011021006',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 2.4',
			'name' 	: 'Báo cáo gói khám',
			'url'	: "Report86"
		}
		
		this.action['Report']['Operation'][1011021007] = {
			'id'	: '1011021007',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 3',
			'name' 	: 'Số lượt bệnh nhân đến khám theo độ tuổi',
			'url'	: "Report04"
		}
		
		this.action['Report']['Operation'][1011021008] = {
			'id'	: '1011021008',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 5',
			'name' 	: 'Số lượt bệnh nhân theo loại khám',
			'url'	: "Report05"
		}
		
		this.action['Report']['Operation'][1011021009] = {
			'id'	: '1011021009',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 6',
			'name' 	: 'Phân bố bệnh nhân theo nơi cư ngụ',
			'url'	: "Report06"
		}
		
		this.action['Report']['Operation'][1011021010] = {
			'id'	: '1011021010',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 7',
			'name' 	: 'Số lượt bệnh nhân theo thời gian',
			'url'	: "Report07"
		}
		
		this.action['Report']['Operation'][1011021027] = {
			'id'	: '1011021027',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 8',
			'name' 	: 'Thống kê HSBA BN ngoại trú',
			'url'	: "Report106"
		}
		
		this.action['Report']['Operation'][1011021011] = {
			'id'	: '1011021011',
			'type'  : 'Ngoại trú',
			'order' : 'Biểu 9',
			'name' 	: 'Số bệnh nhân tái khám theo toa thuốc',
			'url'	: "Report75"
		}
		
		this.action['Report']['Operation'][1011021012] = {
			'id'	: '1011021012',
			'type'  : 'Nội trú',
			'order' : 'Biểu 10',
			'name' 	: 'Danh sách bệnh nhân nhập viện',
			'url'	: "Report48"
		}
		
		// new 23/08/2012
		this.action['Report']['Operation'][1011021019] = {
			'id'	: '1011021019',
			'type'  : 'Nội trú',
			'order' : 'Biểu 10.1',
			'name' 	: 'Báo cáo lưu trữ hồ sơ bệnh án',
			'url'	: "Report98"
		}

		this.action['Report']['InsuranceReport'][1011021013] = {
			'id'	: '1011021013',
			'type'  : 'BHYT',
			'order' : 'Biểu 11',
			'name' 	: 'Thống kê số lượt KCB BHYT',
			'url'	: "Report18', 2)"
		}
		
		this.action['Report']['Operation'][1011021014] = {
			'id'	: '1011021014',
			'type'  : 'Tổng hợp KCB',
			'order' : 'Biểu 12',
			'name' 	: 'Thống kê số lượt KCB',
			'url'	: "Report19', 2)"
		}
		
		this.action['Report']['Operation'][1011021015] = {
			'id'	: '1011021015',
			'type'  : 'Tổng hợp KCB',
			'order' : 'Biểu 15',
			'name' 	: 'Danh sách bệnh nhân tái khám nhiều lần',
			'url'	: "Report80"
		}
		
		this.action['Report']['Operation'][1011021016] = {
			'id'	: '1011021016',
			'type'  : 'Khác',
			'order' : 'Biểu 16',
			'name' 	: 'Thống kê thao tác người quản trị',
			'url'	: "Report68"
		}
		
		this.action['Report']['Operation'][1011021017] = {
			'id'	: '1011021017',
			'type'  : 'Khác',
			'order' : 'Biểu 17',
			'name' 	: 'Thống kê thao tác dược',
			'url'	: "Report71"
		}
		
		this.action['Report']['Operation'][1011021018] = {
			'id'	: '1011021018',
			'type'  : 'Khác',
			'order' : 'Biểu 18',
			'name' 	: 'Danh sách bệnh nhân đã in thẻ',
			'url'	: "Report81"
		}
		
		// new 23/08/2012
		this.action['Report']['Operation'][1011021020] = {
				'id'	: '1011021020',
				'type'  : 'Khác',
				'order' : 'Biểu 19',
				'name' 	: 'Tra Hồ sơ bệnh án',
				'url'	: "javascript:searchHsba()"
		}
		
		// new 23/08/2012
		this.action['Report']['Operation'][1011021021] = {
				'id'	: '1011021021',
				'type'  : 'Khác',
				'order' : 'Biểu 20',
				'name' 	: 'Công suất sử dụng giường',
				'url'	: "Report97"
		}
		
		// new 3/09/2012
		this.action['Report']['Operation'][1011021022] = {
				'id'	: '1011021022',
				'type'  : 'Khác',
				'order' : 'Biểu 21',
				'name' 	: 'Báo cáo KHTH',
				'url'	: "Report99"
		}
		
		this.action['Report']['Operation'][1011021023] = {
			'id'	: '1011021023',
			'type'  : 'Tổng hợp KCB',
			'order' : 'Biểu 29',
			'name' 	: 'Hoạt động khám bệnh',
			'url'	: "Report01"
		}
		
		this.action['Report']['Operation'][1011021024] = {
			'id'	: '1011021024',
			'type'  : 'Tổng hợp KCB',
			'order' : 'Biểu 30',
			'name' 	: 'Hoạt động điều trị',
			'url'	: "Report13"
		}
		
		this.action['Report']['Operation'][1011021025] = {
			'id'	: '1011021025',
			'type'  : 'Hoạt động năm',
			'order' : 'Biểu 31',
			'name' 	: 'Hoạt động phẫu thuật, thủ thuật năm',
			'url'	: "Report02"
		}		
		
		this.action['Report']['Operation'][1011021026] = {
			'id'	: '1011021026',
			'type'  : 'Hoạt động năm',
			'order' : 'Biểu 33',
			'name' 	: 'Hoạt động cận lâm sàng quý năm',
			'url'	: "Report44"
		}
		
		//begin add 23/11/2017
		this.action['Report']['Operation'][1011021033] = {
				'id'	: '1011021033',
				'type'  : 'Hoạt động năm',
				'order' : 'Biểu 37',
				'name' 	: 'Hoạt động sức khoẻ sinh sản',
				'url'	: "Report112"
		}
		
		this.action['Report']['Operation'][1011021034] = {
				'id'	: '1011021034',
				'type'  : 'Hoạt động năm',
				'order' : 'Biểu 38',
				'name' 	: 'Hoạt động tài chính năm 10.1',
				'url'	: "Report40"
		}
		
		this.action['Report']['Operation'][1011021035] = {
				'id'	: '1011021035',
				'type'  : 'Hoạt động năm',
				'order' : 'Biểu 39',
				'name' 	: 'Hoạt động tài chính năm 10.2',
				'url'	: "Report113"
		}
		
		this.action['Report']['Operation'][1011021036] = {
				'id'	: '1011021036',
				'type'  : 'Hoạt động năm',
				'order' : 'Biểu 40',
				'name' 	: 'Hoạt động tài chính năm 10.3',
				'url'	: "Report114"
		}
		
		this.action['Report']['Operation'][1011021037] = {
				'id'	: '1011021037',
				'type'  : 'Hoạt động năm',
				'order' : 'Biểu 41',
				'name' 	: 'Tình hình hoạt động BHYT',
				'url'	: "Report45"
		}
		
		this.action['Report']['Operation'][1011021038] = {
				'id'	: '1011021038',
				'type'  : 'Hoạt động năm',
				'order' : 'Biểu 42',
				'name' 	: 'Tình hình cán bộ, công chức, viên chức',
				'url'	: "Report115"
		}
		
		//end 23/11/2017
		
		this.action['Report']['Operation'][1011021032] = {
			'id'	: '1011021032',
			'type'  : 'Hoạt động năm',
			'order' : 'Biểu 33b',
			'name' 	: 'Tình hình bệnh tật, tử vong tại bệnh viện theo ICD 10 - WHO',
			'url'	: "Report11"
		}
		
		this.action['Report']['Operation'][1011021028] = {
			'id'	: '1011021028',
			'type'  : 'Khác',
			'order' : 'Biểu 34',
			'name' 	: 'Thống kê vân tay bác sĩ phẫu thuật',
			'url'	: "Report107"
		}
		
		this.action['Report']['Operation'][1011021029] = {
			'id'	: '1011021029',
			'type'  : 'Khác',
			'order' : 'Biểu 35',
			'name' 	: 'Thống kê danh sách bác sĩ - nhân viên đã lấy dấu vân tay',
			'url'	: "Report110"
		}
		
		this.action['Report']['Operation'][1011021030] = {
			'id'	: '1011021030',
			'type'  : 'Khác',
			'order' : 'Biểu 36',
			'name' 	: 'Thống kê lịch sử thuốc tồn kho',
			'url'	: "Report109"
		}
		
		this.action['Report']['Operation'][1011021031] = {
			'id'	: '1011021031',
			'type'  : 'Khác',
			'order' : 'Biểu 36',
			'name' 	: 'Thống kê lịch phẫu thuật',
			'url'	: "Report111"
		}
		
// -- REPORT SECTION ----- BAO CAO DUOC ----- 101 103 1xxx
		this.action['Report']['Pharmacy_Report'] = [];
		this.action['Report']['Pharmacy_Report'][1011031001] = {
			'id'	: '1011031001',
			'type'  : 'Kho dược',
			'order' : 'Biểu 1',
			'name' 	: 'Báo cáo bán thuốc độc',
			'url'	: "PhaReport02"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031002] = {
			'id'	: '1011031002',
			'type'  : 'Kho dược',
			'order' : 'Biểu 2',
			'name' 	: 'Báo cáo thẻ kho',
			'url'	: "PhaReport03"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031003] = {
			'id'	: '1011031003',
			'type'  : 'Kho dược',
			'order' : 'Biểu 3',
			'name' 	: 'Báo cáo nhập xuất tồn',
			'url'	: "PhaReport04"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031004] = {
			'id'	: '1011031004',
			'type'  : 'Kho dược',
			'order' : 'Biểu 3.1',
			'name' 	: 'Báo cáo nhập xuất tồn (phân loại thuốc)',
			'url'	: "PhaReport19"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031005] = {
			'id'	: '1011031005',
			'type'  : 'Kho dược',
			'order' : 'Biểu 5',
			'name' 	: 'Thống kê xuất thuốc-vật tư đến quầy thuốc',
			'url'	: "PhaReport05"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031006] = {
			'id'	: '1011031006',
			'type'  : 'Kho dược',
			'order' : 'Biểu 6',
			'name' 	: 'Thống kê xuất thuốc-vật tư đến khoa nội trú',
			'url'	: "PhaReport06"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031007] = {
			'id'	: '1011031007',
			'type'  : 'Kho dược',
			'order' : 'Biểu 7',
			'name' 	: 'Thống kê nhập lại thuốc-vật tư từ quầy thuốc',
			'url'	: "PhaReport08"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031008] = {
			'id'	: '1011031008',
			'type'  : 'Kho dược',
			'order' : 'Biểu 8',
			'name' 	: 'Thống kê số lượng tồn kho hiện tại',
			'url'	: "PhaReport10"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031009] = {
			'id'	: '1011031009',
			'type'  : 'Kho dược',
			'order' : 'Biểu 9',
			'name' 	: 'Thống kê nhập lại thuốc-vật tư từ khoa nội trú',
			'url'	: "PhaReport09"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031010] = {
			'id'	: '1011031010',
			'type'  : 'Kho dược',
			'order' : 'Biểu 10',
			'name' 	: 'Danh sách hóa đơn nhập từ nhà cung cấp',
			'url'	: "PhaReport07"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031011] = {
			'id'	: '1011031011',
			'type'  : 'Kho dược',
			'order' : 'Biểu 11',
			'name' 	: 'Danh sách hóa đơn nhập từ nhà cung cấp (Mẫu 02)',
			'url'	: "PhaReport11"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031012] = {
			'id'	: '1011031012',
			'type'  : 'Kho dược',
			'order' : 'Biểu 12',
			'name' 	: 'Thống kê xuất cấp thuốc-vật tư cho BN nội trú',
			'url'	: "PhaReport12"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031013] = {
			'id'	: '1011031013',
			'type'  : 'Kho dược',
			'order' : 'Biểu 15',
			'name' 	: 'Thống kê bán thuốc-vật tư cho BN tại quầy thuốc',
			'url'	: "PhaReport13"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031014] = {
			'id'	: '1011031014',
			'type'  : 'Kho dược',
			'order' : 'Biểu 16',
			'name' 	: 'Thống kê nhập thuốc-vật tư từ nhà cung cấp',
			'url'	: "PhaReport14"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031015] = {
			'id'	: '1011031015',
			'type'  : 'Kho dược',
			'order' : 'Biểu 17',
			'name' 	: 'Thuốc, vật tư, y cụ sắp hết (kho dược)',
			'url'	: "PhaReport15"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031016] = {
			'id'	: '1011031016',
			'type'  : 'Kho dược',
			'order' : 'Biểu 18',
			'name' 	: 'Danh mục thuốc, vật tư, y cụ',
			'url'	: "PhaReport16"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031017] = {
			'id'	: '1011031017',
			'type'  : 'Kho dược',
			'order' : 'Biểu 19',
			'name' 	: 'Thuốc, vật tư, y cụ sắp hết hạn (kho dược)',
			'url'	: "PhaReport17"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031018] = {
			'id'	: '1011031018',
			'type'  : 'Kho dược',
			'order' : 'Biểu 20',
			'name' 	: 'Xuất nhập tồn trong ngày',
			'url'	: "PhaReport18"
		}
		
		this.action['Report']['InsuranceReport'][1011031019] = {
			'id'	: '1011031019',
			'type'  : 'BHYT',
			'order' : 'Biểu 21',
			'name' 	: 'Thống kê VTYT/thuốc điều trị cho bệnh nhân BHYT (Mẫu: 19-20/bhyt)',
			'url'	: "Report82"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031020] = {
			'id'	: '1011031020',
			'type'  : 'Kho dược',
			'order' : 'Biểu 22',
			'name' 	: 'Thống kê thuốc/vật tư hết hạn',
			'url'	: "PhaReport20"
		}
		
		// new 23/08/2012
		this.action['Report']['Pharmacy_Report'][1011031040] = {
				'id'	: '1011031040',
				'type'  : 'Kho dược',
				'order' : 'Biểu 23',
				'name' 	: 'Sổ kiểm nhập thuốc, hóa chất, vật tư tiêu hao',
				'url'	: "PhaReport21"
		}
		
		// new 01/10/2012
		this.action['Report']['Pharmacy_Report'][1011031041] = {
				'id'	: '1011031041',
				'type'  : 'Kho dược',
				'order' : 'Biểu 24',
				'name' 	: 'Diễn biến giá thuốc',
				'url'	: "PhaReport22"
		}
		
		// new 19/11/2012
		this.action['Report']['Pharmacy_Report'][1011031042] = {
				'id'	: '1011031042',
				'type'  : 'Kho dược',
				'order' : 'Biểu 25(Mới)',
				'name' 	: 'Thống kê tình hình nhập - bán thuốc theo nhà cung cấp',
				'url'	: "PhaReport23"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031043] = {
				'id'	: '1011031043',
				'type'  : 'Kho dược',
				'order' : 'Biểu 26',
				'name' 	: 'Thống kê giá bán và giá BHYT của thuốc',
				'url'	: "Report108"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031021] = {
			'id'	: '1011031021',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 1',
			'name' 	: 'Báo cáo doanh thu quầy thuốc',
			'url'	: "DstReport01"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031022] = {
			'id'	: '1011031022',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 2',
			'name' 	: 'Báo cáo nhập xuất tồn',
			'url'	: "DstReport02"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031023] = {
			'id'	: '1011031023',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 2.1',
			'name' 	: 'Báo cáo nhập xuất tồn (phân loại thuốc)',
			'url'	: "DstReport12"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031024] = {
			'id'	: '1011031024',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 3',
			'name' 	: 'Báo cáo thẻ kho',
			'url'	: "DstReport03"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031025] = {
			'id'	: '1011031025',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 5',
			'name' 	: 'Báo cáo hóa đơn bán thuốc',
			'url'	: "DstReport04"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031026] = {
			'id'	: '1011031026',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 6',
			'name' 	: 'Thống kê nhận thuốc tại quầy thuốc',
			'url'	: "DstReport05"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031027] = {
			'id'	: '1011031027',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 7',
			'name' 	: 'Thống kê số lượng tồn kho hiện tại',
			'url'	: "DstReport06"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031028] = {
			'id'	: '1011031028',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 8',
			'name' 	: 'Thuốc, vật tư, y cụ sắp hết (quầy thuốc)',
			'url'	: "DstReport07"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031029] = {
			'id'	: '1011031029',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 9',
			'name' 	: 'Thống kê BN trả thuốc',
			'url'	: "DstReport08"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031030] = {
			'id'	: '1011031030',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 10',
			'name' 	: 'Thuốc, vật tư, y cụ sắp hết hạn (quầy thuốc)',
			'url'	: "DstReport09"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031031] = {
			'id'	: '1011031031',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 11',
			'name' 	: 'Xuất nhập tồn trong ngày',
			'url'	: "DstReport10"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031032] = {
			'id'	: '1011031032',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 12',
			'name' 	: 'Thống kê thuốc được kê và bán theo Bác sĩ',
			'url'	: "DstReport11"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031033] = {
			'id'	: '1011031033',
			'type'  : 'Nhà thuốc',
			'order' : 'Biểu 15',
			'name' 	: 'Thống kê thuốc/vật tư hết hạn',
			'url'	: "DstReport13"
		}
		
		this.action['Report']['Pharmacy_Report'][1011031034] = {
			'id'	: '1011031034',
			'type'  : 'Khoa nội trú',
			'order' : 'Biểu 1',
			'name' 	: 'Báo cáo nhập xuất tồn',
			'url'	: "DepReport01', 1)"
		}
		this.action['Report']['Pharmacy_Report'][1011031035] = {
			'id'	: '1011031035',
			'type'  : 'Khoa nội trú',
			'order' : 'Biểu 1.1',
			'name' 	: 'Báo cáo nhập xuất tồn (phân loại thuốc)',
			'url'	: "DepReport05', 1)"
		}
		this.action['Report']['Pharmacy_Report'][1011031036] = {
			'id'	: '1011031036',
			'type'  : 'Khoa nội trú',
			'order' : 'Biểu 2',
			'name' 	: 'Thống kê số lượng tồn kho hiện tại',
			'url'	: "DepReport02', 1)"
		}
		this.action['Report']['Pharmacy_Report'][1011031037] = {
			'id'	: '1011031037',
			'type'  : 'Khoa nội trú',
			'order' : 'Biểu 3',
			'name' 	: 'Báo cáo thẻ kho',
			'url'	: "DepReport03', 1)"
		}
		this.action['Report']['Pharmacy_Report'][1011031038] = {
			'id'	: '1011031038',
			'type'  : 'Khoa nội trú',
			'order' : 'Biểu 5',
			'name' 	: 'Xuất nhập tồn trong ngày',
			'url'	: "DepReport04"
		}
		this.action['Report']['Pharmacy_Report'][1011031039] = {
			'id'	: '1011031039',
			'type'  : 'Khoa nội trú',
			'order' : 'Biểu 6',
			'name' 	: 'Thống kê thuốc/vật tư hết hạn',
			'url'	: "DepReport06', 1)"
		}

		
// -- ACTION SECTION ----- CHINH SUA DU LIEU NGOAI TRU ----- 102 106 1xxx
		// new 27/08/2012
		this.action['Action'] = [];
		this.action['Action']['Out_Admin'] = [];
		this.action['Action']['Out_Admin'][1021061001] = {
				'id'	: '1021061001',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Xóa dịch vụ chưa thu tiền',
				'url'	: "OutPaymentOT/ViewPayment"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061002] = {
				'id'	: '1021061002',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Đổi phân loại khám',
				'url'	: "OutPaymentAdmin/ChangeExamType"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061003] = {
				'id'	: '1021061003',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Chuyển bệnh nhân vào bác sĩ khám',
				'url'	: "OutPatientRegisterAdmin/SearchPatientReRegister"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061004] = {
				'id'	: '1021061004',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Hoàn tiền viện phí',
				'url'	: "OutPaymentAdmin/PaymentReturn"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061005] = {
				'id'	: '1021061005',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Phân luồng bệnh nhân',
				'url'	: "DrDistribution/Manage"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061006] = {
				'id'	: '1021061006',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Đổi bác sĩ cho dịch vụ đã đăng kí',
				'url'	: "OutPaymentAdmin/ChangeAssignmentInfo"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061007] = {
				'id'	: '1021061007',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Chỉnh sửa lịch sử khám',
				'url'	: "OutConsultationHisAdmin/DisplayDesktop"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061008] = {
				'id'	: '1021061008',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Chỉnh sửa thông tin đợt khám',
				'url'	: "OutPatientAdmin/ManageTicket"
		}
		
		// new 27/08/2012
		this.action['Action']['Out_Admin'][1021061009] = {
				'id'	: '1021061009',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Kiểm tra chỉ định cls',
				'url'	: "ClsCheckingProgress/DisplayDesktopOutpatient"
		}
		
// -- ACTION SECTION ----- CHINH SUA DU LIEU NOI TRU ----- 102 107 1xxx
		// new 27/08/2012
		this.action['Action']['In_Admin'] = [];
		this.action['Action']['In_Admin'][1021071001] = {
				'id'	: '1021071001',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Sửa dịch vụ chưa thu tiền của đợt điều trị cuối',
				'url'	: "InPaymentAdmin/ManageTreatment"
		}
		
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071002] = {
				'id'	: '1021071002',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Thêm và sửa dịch vụ chưa thu tiền của các đợt điều trị',
				'url'	: "EditInpatientDataAdmin/ManageTreatment"
		}
		
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071003] = {
				'id'	: '1021071003',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Cấu hình các ngưỡng thanh toán nội trú',
				'url'	: "PayDepartmentBalanceLimit/GetConfigurationList"
		}
		
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071004] = {
				'id'	: '1021071004',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Hoàn tiền viện phí',
				'url'	: "InPaymentAdmin/PaymentReturnTwo"
		}

		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071005] = {
				'id'	: '1021071005',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Xoá phiếu thu tạm ứng',
				'url'	: "InPaymentAdmin/DeleteTamUngInvoice"
		}
		
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071006] = {
				'id'	: '1021071006',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Khóa/Mở khóa viện phí nội trú',
				'url'	: "UnlockPatient/DisplayUnlockPatientPage"
		}
		
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071007] = {
				'id'	: '1021071007',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Phục hồi xuất viện sai bệnh nhân',
				'url'	: "CheckInOutHospitalRecord/DisplayCheckInOutHospitalRecordPage"
		}
		
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071008] = {
				'id'	: '1021071008',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Khóa/Mở khóa xuất viện',
				'url'	: "UnlockToCheckOut/DisplayUnlockToCheckOutPage"
		}
			
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071009] = {
				'id'	: '1021071009',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Sửa thông tin nhập/xuất viện',
				'url'	: "InPatientAdmin/ManageTreatment"
		}
													
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071010] = {
				'id'	: '1021071010',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Kiểm tra chỉ định cls',
				'url'	: "ClsPortal/Workspace"
		}
			
		// new 27/08/2012
		this.action['Action']['In_Admin'][1021071011] = {
				'id'	: '1021071011',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Tìm bệnh nhân có chỉ định cls',
				'url'	: "ClsPortal/SearchPatient"
		}
				
// -- ACTION SECTION ----- QUAN LY DICH VU ----- 102 101 1xxx
		this.action['Action']['Service'] = [];
		this.action['Action']['Service'][1021011001] = {
			'id'	: '1021011001',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Danh sách dịch vụ',
			'url'	: "ServiceAdmin/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Service'][1021011006] = {
				'id'	: '1021011006',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Chi tiết dịch vụ (Read Only)',
				//'url'	: "ServiceAdmin/ViewOnly"
				'url'	: "user/find"
		}
		
		this.action['Action']['Service'][1021011002] = {
			'id'	: '1021011002',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Danh sách gói khám sức khỏe',
			'url'	: "ServicePackage/Management"
		}
		
		this.action['Action']['Service'][1021011003] = {
			'id'	: '1021011003',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Đăng ký gói khám cho bệnh nhân',
			'url'	: "RegisterConsultationPackage/Register"
		}
		
		this.action['Action']['Service'][1021011004] = {
			'id'	: '1021011004',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Nhóm dịch vụ',
			'url'	: "ServiceGroup/Management"
		}
		
		this.action['Action']['Service'][1021011005] = {
			'id'	: '1021011005',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Dịch vụ phẫu thuật BHYT',
			'url'	: "ServiceAdmin/Management?item_type=surgery&"
		}
		
		this.action['Action']['Service'][1021011007] = {
			'id'	: '1021011007',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Coupon giảm giá',
			'url'	: "Coupon/manage"
		}
		
		this.action['Action']['Service'][1021011008] = {
			'id'	: '1021011008',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Khách hàng tiềm năng',
			'url'	: "PotentialPatient/manage"
		}
		
		
// -- ACTION SECTION ----- QUAN LY DUOC ----- 102 102 1xxx
this.action['Action']['Pharmacy_Management'] = [];
		this.action['Action']['Pharmacy_Management'][1021021001] = {
			'id'	: '1021021001',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Danh mục thuốc',
			'url'	: "DrugMaterial/ManageDrugInAdmin"
		}
	
		this.action['Action']['Pharmacy_Management'][1021021002] = {
			'id'	: '1021021002',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Tìm toa thuốc',
			'url'	: "OutPaymentAdmin/SearchPrescription"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021003] = {
			'id'	: '1021021003',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Tìm phiếu nhập',
			'url'	: "EwhImportDrugMaterial/DisplayEditImTickPage?viewOnly=1&"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021004] = {
			'id'	: '1021021004',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Nhập trả thuốc bn ngoại trú',
			'url'	: "DstReturnDrugMaterial/ReturnDrug"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021005] = {
			'id'	: '1021021005',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Sửa dữ liệu kiểm kê của khoa phòng',
			'url'	: "InventoryAdmin/InventoryDept"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021006] = {
			'id'	: '1021021006',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Sửa dữ liệu kiểm kê của quầy thuốc',
			'url'	: "InventoryAdmin/drugStoreData"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021007] = {
			'id'	: '1021021007',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Sửa dữ liệu kiểm kê của kho dược',
			'url'	: "InventoryAdmin/phaData"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021008] = {
			'id'	: '1021021008',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Cấu hình ngưỡng tối đa tồn thuốc, vật tư, y cụ',
			'url'	: "IdmLimitDrugAdvance/DisplayDesktop"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021009] = {
			'id'	: '1021021009',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Cập nhật giá bán thuốc',
			'url'	: "DrugMaterial/UpdateDrugPriceInAdmin"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021015] = {
				'id'	: '1021021015',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Cấu hình in toa thuốc tại quầy',
				'url'	: "DrugMaterial/SetPermisionPrintAdmin"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021010] = {
			'id'	: '1021021010',
			'type'  : 'Quản lý kho',
			'order' : '',
			'name' 	: 'Nhập kho',
			'url'	: "EwhImportDrugMaterial/DisplayDesktop"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021011] = {
			'id'	: '1021021011',
			'type'  : 'Quản lý kho',
			'order' : '',
			'name' 	: 'Xuất kho',
			'url'	: "EwhExportQueue/DisplayDesktop"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021012] = {
			'id'	: '1021021012',
			'type'  : 'Quản lý kho',
			'order' : '',
			'name' 	: 'Tra cứu thuốc/vật tư/y cụ',
			'url'	: "javascript:loadWebPageAjax('globalAjaxContent',%20'../DrugSearch/ViewSearchPage'}"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021013] = {
			'id'	: '1021021013',
			'type'  : 'Quản lý kho',
			'order' : '',
			'name' 	: 'Cấu hình',
			'url'	: "Configuration/configPharmacy"
		}
		
		this.action['Action']['Pharmacy_Management'][1021021014] = {
			'id'	: '1021021014',
			'type'  : 'Quản lý kho',
			'order' : '',
			'name' 	: 'Quản lý người dùng khoa dược',
			'url'	: "PharmacyUser/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021016] = {
				'id'	: '1021021016',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Hãng sản xuất',
				'url'	: "Manufacturer/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021017] = {
				'id'	: '1021021017',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Nhà cung cấp',
				'url'	: "EwhProviderDrug/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021018] = {
				'id'	: '1021021018',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Phân loại độc',
				'url'	: "PoisonType/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021019] = {
				'id'	: '1021021019',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Thuốc gốc',
				'url'	: "DrugOriginalName/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021020] = {
				'id'	: '1021021020',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Nhóm dược lý',
				'url'	: "Pharmacology/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021021] = {
				'id'	: '1021021021',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Vật tư',
				'url'	: "javascript:openMaterialDialog(}"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021022] = {
				'id'	: '1021021022',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Y cụ',
				'url'	: "javascript:openHealthToolDialog(}"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021023] = {
				'id'	: '1021021023',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Thuốc BHYT',
				'url'	: "DrugMaterial/MedicalInsuranceManagement"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021024] = {
				'id'	: '1021021024',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Thuốc',
				'url'	: "javascript:openDrugDialog(1}"
		}
		
		// new 23/08/2012
		this.action['Action']['Pharmacy_Management'][1021021025] = {
				'id'	: '1021021025',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Thuốc đông y',
				'url'	: "javascript:openDrugDongYDialog(4}"
		}
		
// -- ACTION SECTION ----- QUAN LY THONG TIN BHYT ----- 102 103 1xxx
		this.action['Action']['BHYT'] = [];
		this.action['Action']['BHYT'][1021031001] = {
			'id'	: '1021031001',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Chi trả BHYT ngoại trú',
			'url'	: "OutPaymentIns/ViewPayment"
		}
		
		this.action['Action']['BHYT'][1021031002] = {
			'id'	: '1021031002',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Chi trả BHYT nội trú',
			'url'	: "InPaymentIns/ViewPaymentBHYTAdmin"
		}
		
		this.action['Action']['BHYT'][1021031003] = {
			'id'	: '1021031003',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Danh mục thuốc, vật tư, y cụ',
			'url'	: "DrugMaterial/ManageDrugToolInAdmin"
		}
		
		this.action['Action']['BHYT'][1021031004] = {
			'id'	: '1021031004',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Chỉnh sửa nơi đăng ký khám chữa bệnh ban đầu',
			'url'	: "HospitalAdmin/Management"
		}
		
		this.action['Action']['BHYT'][1021031005] = {
			'id'	: '1021031005',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Cấu hình danh sách dịch vụ phẫu thuật BHYT',
			'url'	: "ServiceAdmin/ConfigSurgeryService"
		}
		
		this.action['Action']['BHYT'][1021031006] = {
			'id'	: '1021031006',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Kiểm tra thanh toán BHYT',
			'url'	: "InPatientBhytBlCheckoutInvoice/DisplayDesktopBHYT"
		}
		
		this.action['Action']['BHYT'][1021031007] = {
			'id'	: '1021031007',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Kiểm tra thanh toán bảo hiểm bảo lãnh',
			'url'	: "InPatientBhytBlCheckoutInvoice/DisplayDesktop"
		}
		
		// new 23/08/2012
		this.action['Action']['BHYT'][1021031008] = {
				'id'	: '1021031008',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Thu BHBL',
				'url'	: "InPatientBhytBlCheckoutInvoice/DisplayDesktop"
		}
		
		// new 10/12/2013
        this.action['Action']['BHYT'][1021039000] = {
            'id'	: '1021039000',
            'type'  : 'Admin',
            'order' : '',
            'name' 	: 'Sửa toa thuốc',
            'url'	: "InsHackPrescription/DisplayDesktop"
        }	
    	
    	this.action['Action']['BHYT'][1021031009] = {
			'id'	: '1021031009',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Thuốc BHYT dự kiến áp dụng',
			'url'	: "DrugMaterialInsuranceLog/MedicalInsuranceManagement"
		}
		
		this.action['Action']['BHYT'][1021031010] = {
			'id'	: '1021031010',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Danh mục công ty bảo hiểm',
			'url'	: "InsuranceCompany/management"
		}
		
		this.action['Action']['BHYT'][1021031011] = {
			'id'	: '1021031011',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Danh sách khách hàng doanh nghiệp',
			'url'	: "MembershipWhitelist/manage"
		}
		
// -- ACTION SECTION ----- QUAN LY THONG TIN KHOA/PHONG/GIUONG ----- 102 104 1xxx
		this.action['Action']['Bed_Management'] = [];
		this.action['Action']['Bed_Management'][1021041001] = {
			'id'	: '1021041001',
			'type'  : 'Danh mục',
			'order' : '',
			'name' 	: 'Thông tin khoa, phòng, giường',
			'url'	: "Department/viewDepartment"
		}
		
		this.action['Action']['Bed_Management'][1021041002] = {
			'id'	: '1021041002',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Quản lý giường',
			'url'	: "BedManagement/AdminView"
		}
		
		this.action['Action']['Bed_Management'][1021041003] = {
			'id'	: '1021041003',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Sửa lịch sử giường bệnh nhân',
			'url'	: "BedHistoryManagement/AdminView"
		}
		
// -- ACTION SECTION ----- QUAN LY THONG TIN BENH NHAN ----- 102 105 1xxx
		this.action['Action']['Patient'] = [];
		this.action['Action']['Patient'][1021051001] = {
			'id'	: '1021051001',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Chi tiết bệnh nhân',
			'url'	: "SearchPatientInfoPayment/DisplayDesktop"
		}
		
		this.action['Action']['Patient'][1021051002] = {
			'id'	: '1021051002',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Tìm và sửa thông tin bệnh nhân',
			'url'	: "PatientFinder/Search"
		}
		
		// new 23/08/2012
		this.action['Action']['Patient'][1021051003] = {
				'id'	: '1021051003',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Nghề nghiệp',
				'url'	: "Career/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Patient'][1021051004] = {
				'id'	: '1021051004',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Quốc gia',
				'url'	: "Country/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Patient'][1021051005] = {
				'id'	: '1021051005',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Quốc tịch',
				'url'	: "Nationality/Management"
		}
		
		// new 23/08/2012
		this.action['Action']['Patient'][1021051006] = {
				'id'	: '1021051006',
				'type'  : 'Danh mục',
				'order' : '',
				'name' 	: 'Địa bàn',
				'url'	: "Province/viewProvince"
		}
		

// -- ACTION SECTION ----- CHINH SUA DU LIEU TAI KHOAN NGUOI DUNG ----- 102 108 1xxx
		// new 27/08/2012
		this.action['Action']['Account'] = [];
		this.action['Action']['Account'][1021081001] = {
				'id'	: '1021081001',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Tài khoản',
				'url'	: "User/Management"
		}
		
		// new 27/08/2012
		this.action['Action']['Account'][1021081002] = {
				'id'	: '1021081002',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Nhân viên',
				'url'	: "HumanResources/Manage"
		}
		
		// new 27/08/2012
		this.action['Action']['Account'][1021081003] = {
				'id'	: '1021081003',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Phân quyền người dùng',
				'url'	: "Permission/listNormalUser"
		}
		
// -- ACTION SECTION ----- CHINH SUA DU LIEU KHAC ----- 102 109 1xxx
		// new 27/08/2012
		this.action['Action']['Other'] = [];
		this.action['Action']['Other'][1021091001] = {
				'id'	: '1021091001',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Cấu hình hệ thống',
				'url'	: "Configuration/ConfigPharmacy"
		}
		
		// new 27/08/2012
		this.action['Action']['Other'][1021091002] = {
				'id'	: '1021091002',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Chỉnh dữ liệu in thẻ bệnh nhân',
				'url'	: "BarCode/PrintPatientCardDesktop"
		}
		
		this.action['Action']['Other'][1021091010] = {
			'id'	: '1021091010',
			'type'  : 'Admin',
			'order' : '',
			'name' 	: 'Chi tiền công Phẫu thuật',
			'url'	: "SurSurgery/payDoctorCash"
		}
		
		// new 19/06/2013
		this.action['Report']['Other'] = [];
		this.action['Report']['Other'][1021091003] = {
				'id'	: '1021091003',
				'type'  : 'Khác',
				'order' : 'Biểu xx',
				'name' 	: 'Danh sách bệnh nhân thụ hưởng dịch vụ BHYT',
				'url'	: "Report100"
		}
		
		// new 03/07/2013
		this.action['Report']['Other'][1021091004] = {
				'id'	: '1021091004',
				'type'  : 'Khác',
				'order' : 'Biểu xx',
				'name' 	: 'Thống kê cấp thuốc nội trú theo BS',
				'url'	: "Report101"
		}
		
		// new 11/11/2013
		this.action['Report']['Other'][102109105] = {
				'id'	: '1021091005',
				'type'  : 'Khác',
				'order' : 'Biểu other xx',
				'name' 	: 'Danh sách bệnh nhân và dịch vụ BHYT',
				'url'	: "Report102"
		}
		
		this.action['Action']['Other'][1021091007] = {
				'id'	: '1021091007',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Thực hiện Topup ngân hàng Phương Nam',
				'url'	: "BankTransaction/display"
		}
		
		//updated 17/02/2017 by ddthanh
		this.action['Action']['BHYT'][1021091008] = {
				'id'	: '1021091008',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Quản lý Khoa/Phòng BHYT',
				'url'	: "DepartmentHs/viewDepartment"
		}
		
		//updated 17/02/2017 by ddthanh
		this.action['Action']['BHYT'][1021091009] = {
				'id'	: '1021091009',
				'type'  : 'Admin',
				'order' : '',
				'name' 	: 'Quản lý loại giường BHYT',
				'url'	: "BhxhBed/view"
		}

		
		this.groupName = {
			'Report' 				: 'Báo cáo',
			'Action' 				: 'Chức năng',
			'Financial' 			: 'Báo cáo tài chính',
			'Operation' 			: 'Báo cáo hoạt động',
			'Pharmacy_Report' 		: 'Báo cáo dược',
			'InsuranceReport' 		: 'Báo cáo BHYT',
			'Service' 				: 'Quản lý thông tin liên quan đến dịch vụ',
			'Pharmacy_Management' 	: 'Quản lý thông tin liên quan đến dược',
			'BHYT' 					: 'Quản lý thông tin BHYT',
			'Bed_Management'		: 'Khoa / Phòng / Giường',
			'Patient'				: 'Thông tin bệnh nhân',
			'Out_Admin'				: 'Chỉnh sửa dữ liệu ngoại trú',
			'In_Admin'				: 'Chỉnh sửa dữ liệu nội trú',
			'Account'				: 'Nhân viên - Tài khoản',
			'Other'					: 'Khác'
		}
	}
	getActions(){
		return this.action;
	}
	getBHYT(){
		return this.action['Action']['BHYT'];
	}
}
