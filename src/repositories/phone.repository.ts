import { prisma } from "~/utils/prismaClient.ts";

class PhoneRepository {
  /**
   * Batch insert multiple phone records into the database.
   *
   * @param phoneRecords Array of phone objects containing `number`.
   * @param appId The ID of the app associated with all phone records.
   * @param chunkSize Number of records to insert per batch (default: 1000 for optimal performance).
   */
  static async batchCreate(phoneRecords: Array<string>, appId: number, countryId: number, userId: number, chunkSize = 1000) {
    if (!phoneRecords || phoneRecords.length === 0) {
      throw new Error("No phone records provided for batch insert.");
    }

    const totalRecords = phoneRecords.length;

    // Transform phoneRecords into the format required by the database
    const preparedData = phoneRecords.map((record) => ({
      number: record,
      appId, // Assign the same appId to each record
      countryPhoneId: countryId, // Assign the same countryId to each record
      userId, // Assign the same userId to each record
    }));

    // Split the data into chunks for batch processing
    const chunks: Array<typeof preparedData> = [];
    for (let i = 0; i < totalRecords; i += chunkSize) {
      chunks.push(preparedData.slice(i, i + chunkSize));
    }

    const results = [];

    // Insert chunks sequentially to control load on the database
    for (const chunk of chunks) {
      const insertedRecords = await prisma.phone.createMany({
        data: chunk,
        skipDuplicates: true, // Optional: Skip duplicate records
      });
      results.push(insertedRecords);
    }

    return results;
  }

  /**
   * Lấy ngẫu nhiên một số điện thoại thỏa mãn điều kiện
   * `updatedAt < current date - 7 days` hoặc bất kỳ số nào nếu không thỏa mãn điều kiện.
   * Sau khi lấy ra, cập nhật lại trường `updatedAt`.
   *
   * @returns {Promise<string | null>} Số điện thoại được chọn hoặc null nếu không tìm thấy bản ghi nào.
   */
  static async getRandomPhoneAndUpdate(): Promise<string | null> {
    // Tính ngày hiện tại trừ 7 ngày
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Bước 1: Lấy một bản ghi ngẫu nhiên dựa trên điều kiện
    let randomPhone = await prisma.phone.findFirst({
      where: {
        updatedAt: {
          lt: sevenDaysAgo, // updatedAt phải nhỏ hơn 7 ngày trước
        },
      },
      orderBy: {
        id: 'asc', // Hoặc orderBy random nếu cần độ ngẫu nhiên cao hơn
      },
      take: 1, // Giới hạn chỉ lấy 1 bản ghi
    });

    // Bước 2: Nếu không bản ghi nào thỏa mãn điều kiện, lấy ngẫu nhiên một bản ghi bất kỳ
    if (!randomPhone) {
      randomPhone = await prisma.phone.findFirst({
        orderBy: {
          id: 'asc', // Hoặc random (nếu muốn)
        },
        take: 1,
      });
    }

    // Nếu vẫn không có bản ghi nào trong bảng Phone, trả về null
    if (!randomPhone) {
      return null;
    }

    // Bước 3: Cập nhật updatedAt cho bản ghi được chọn
    await prisma.phone.update({
      where: {
        id: randomPhone.id,
      },
      data: {
        updatedAt: new Date(), // Cập nhật thành thời gian hiện tại
      },
    });

    // Trả về số điện thoại được chọn
    return randomPhone.number;
  }
}

export default PhoneRepository;