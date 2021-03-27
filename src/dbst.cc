#include <array>
#include <mutex>
#include <napi.h>
#include <windows.h>

class Dbst : public Napi::ObjectWrap<Dbst>
{
public:
  static void Init(Napi::Env env, Napi::Object exports);
  Dbst(const Napi::CallbackInfo &info);

  Napi::Value ReadData(const Napi::CallbackInfo &info);

  struct BreedHorse
  {
    std::array<char16_t, 10> name = {};
    uint8_t year = 0;
    uint8_t speed = 0;
    uint8_t stamina = 0;
  };

  struct RaceHorse
  {
    std::array<char16_t, 10> name = {};
    uint8_t year = 0;
    uint8_t sex = 0;
    uint_fast16_t bestWeight = 0;
    int8_t diffWeight = 0;
    uint8_t cond = 0;
    uint8_t speed = 0;
    uint8_t speedMax = 0;
    uint8_t stamina = 0;
    uint8_t staminaMax = 0;
    uint8_t guts = 0;
    uint8_t gutsMax = 0;
    uint8_t temper = 0;
    uint8_t temperMax = 0;
    uint8_t dirt = 0;
    uint8_t health = 0;
    uint8_t growth = 0;
    uint8_t xMonth = 0;
  };

private:
  std::mutex _mtx;
  std::array<uint8_t, 9 * 244> _bufferName;
  std::array<uint8_t, 152 * 128> _bufferBreedStatus;
  std::array<uint8_t, 8> _bufferBreedAddress;
  std::array<uint8_t, 120 * 128> _bufferRaceStatus;
  std::array<uint8_t, 40> _bufferRaceAddress;
  std::array<BreedHorse, 8> _dataBreed;
  size_t _dataBreedSize;
  std::array<RaceHorse, 40> _dataRace;
  size_t _dataRaceSize;
  static const std::array<char16_t, 108> CHAR_MAPPING;

  class HandleDeleter
  {
  public:
    typedef HANDLE pointer;

    void operator()(HANDLE handle)
    {
      ::CloseHandle(handle);
    }
  };

  using HandleUniquePtr = std::unique_ptr<HANDLE, HandleDeleter>;

  bool ReadDataInternal();
  Napi::Value Dbst::ConvertData(const Napi::CallbackInfo &info);

  void ReadHorseName(uint_fast16_t index, std::array<char16_t, 10> &name)
  {
    uint_fast16_t address = index * 9;
    for (unsigned int i = 0; i < 9; ++i)
    {
      uint8_t rawChar = _bufferName.at(address + i);
      if (rawChar == 0 || rawChar >= CHAR_MAPPING.size())
      {
        name[i] = u'\0';
        break;
      }
      name[i] = CHAR_MAPPING.at(rawChar);
    }
  }
};

const std::array<char16_t, 108> Dbst::CHAR_MAPPING = {
  u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0',
  u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'\0', u'ア', u'イ', u'ウ', u'エ', u'オ', u'カ',
  u'キ', u'ク', u'ケ', u'コ', u'サ', u'シ', u'ス', u'セ', u'ソ', u'タ', u'チ', u'ツ', u'テ', u'ト', u'ナ', u'ニ',
  u'ヌ', u'ネ', u'ノ', u'ハ', u'ヒ', u'フ', u'ヘ', u'ホ', u'マ', u'ミ', u'ム', u'メ', u'モ', u'ヤ', u'ユ', u'ヨ',
  u'ワ', u'ン', u'ラ', u'リ', u'ル', u'レ', u'ロ', u'ャ', u'ュ', u'ョ', u'ッ', u'ヲ', u'パ', u'ピ', u'プ', u'ペ',
  u'ポ', u'ガ', u'ギ', u'グ', u'ゲ', u'ゴ', u'ザ', u'ジ', u'ズ', u'ゼ', u'ゾ', u'ダ', u'ヂ', u'ヅ', u'デ', u'ド',
  u'バ', u'ビ', u'ブ', u'ベ', u'ボ', u'ー', u'ヴ', u'ァ', u'ィ', u'ゥ', u'ェ', u'ォ',
};

void Dbst::Init(Napi::Env env, Napi::Object exports)
{
  Napi::Function func = DefineClass(
      env, "Dbst",
      {
          InstanceMethod<&Dbst::ReadData>("readData"),
      });
  exports.Set("Dbst", func);
}

Dbst::Dbst(const Napi::CallbackInfo &info) : Napi::ObjectWrap<Dbst>(info)
{
  Napi::Env env = info.Env();
  if (info.Length() != 0)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return;
  }
}

Napi::Value Dbst::ReadData(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  std::unique_lock<std::mutex> lock(_mtx, std::try_to_lock);
  if (!lock.owns_lock())
    return env.Null();

  if (!ReadDataInternal())
    return env.Null();
  return ConvertData(info);
}

bool Dbst::ReadDataInternal()
{
  HWND hWnd = ::FindWindow(nullptr, TEXT("ダービースタリオン for Win"));
  if (hWnd == nullptr)
    return false;
  DWORD dwProcessId = 0;
  ::GetWindowThreadProcessId(hWnd, &dwProcessId);
  if (dwProcessId == 0)
    return false;
  HANDLE hProcess = ::OpenProcess(PROCESS_VM_READ, FALSE, dwProcessId);
  if (hProcess == nullptr)
    return false;
  auto hProcessPtr = HandleUniquePtr(hProcess);
  if (!ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(0x004B8A23), _bufferName.data(), _bufferName.size(), nullptr))
    return false;
  if (!ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(0x004B4060), _bufferBreedStatus.data(), _bufferBreedStatus.size(), nullptr))
    return false;
  if (!ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(0x004B75A4), _bufferBreedAddress.data(), _bufferBreedAddress.size(), nullptr))
    return false;
  if (!ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(0x004B4C20), _bufferRaceStatus.data(), _bufferRaceStatus.size(), nullptr))
    return false;
  if (!ReadProcessMemory(hProcess, reinterpret_cast<LPCVOID>(0x004B75AC), _bufferRaceAddress.data(), _bufferRaceAddress.size(), nullptr))
    return false;
  _dataBreedSize = 0;
  _dataRaceSize = 0;
  for (uint_fast16_t address : _bufferBreedAddress)
  {
    if (address > 0x7f)
      continue;
    address *= 152;
    uint_fast16_t nameIndex = (static_cast<uint_fast16_t>(_bufferBreedStatus.at(address + 1)) << 8) ^ _bufferBreedStatus.at(address + 0);
    if (nameIndex < 0x8dd)
      continue;
    nameIndex -= 0x8dd;
    BreedHorse &data = _dataBreed[_dataBreedSize++];
    ReadHorseName(nameIndex, data.name);
    data.year = _bufferBreedStatus.at(address + 2) + 1;
    data.speed = _bufferBreedStatus.at(address + 10);
    data.stamina = _bufferBreedStatus.at(address + 11);
  }
  for (uint_fast16_t address : _bufferRaceAddress)
  {
    if (address > 0x7f)
      continue;
    address *= 120;
    RaceHorse &data = _dataRace[_dataRaceSize++];
    ReadHorseName(_bufferRaceStatus.at(address + 2), data.name);
    data.year = (_bufferRaceStatus.at(address + 4) >> 2) + 1;
    data.sex = _bufferRaceStatus.at(address + 4) & 0x3;
    data.bestWeight = (static_cast<uint_fast16_t>(_bufferRaceStatus.at(address + 29)) << 1) | 0x100;
    data.diffWeight = static_cast<int8_t>(_bufferRaceStatus.at(address + 86));
    data.cond = _bufferRaceStatus.at(address + 46) & 0xf;
    data.speed = _bufferRaceStatus.at(address + 30);
    data.stamina = _bufferRaceStatus.at(address + 31);
    data.guts = _bufferRaceStatus.at(address + 32);
    data.temper = _bufferRaceStatus.at(address + 33);
    data.speedMax = _bufferRaceStatus.at(address + 36);
    data.staminaMax = _bufferRaceStatus.at(address + 37);
    data.gutsMax = _bufferRaceStatus.at(address + 38);
    data.temperMax = _bufferRaceStatus.at(address + 39);
    data.dirt = _bufferRaceStatus.at(address + 40);
    data.health = _bufferRaceStatus.at(address + 41);
    data.growth = _bufferRaceStatus.at(address + 35) >> 3;
    data.xMonth = _bufferRaceStatus.at(address + 35) & 0x7;
  }
  return true;
}

Napi::Value Dbst::ConvertData(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  Napi::Object retData = Napi::Object::New(env);
  {
    size_t size = _dataBreedSize;
    Napi::Array array = Napi::Array::New(env, size);
    for (size_t i = 0; i < size; ++i)
    {
      auto &data = _dataBreed[i];
      Napi::Object obj = Napi::Object::New(env);
      obj.Set("name", data.name.data());
      obj.Set("year", data.year);
      obj.Set("speed", data.speed);
      obj.Set("stamina", data.stamina);
      array.Set(i, obj);
    }
    retData.Set("breed", array);
  }
  {
    size_t size = _dataRaceSize;
    Napi::Array array = Napi::Array::New(env, size);
    for (size_t i = 0; i < size; ++i)
    {
      auto &data = _dataRace[i];
      Napi::Object obj = Napi::Object::New(env);
      obj.Set("name", data.name.data());
      obj.Set("year", data.year);
      obj.Set("sex", data.sex);
      obj.Set("bestWeight", data.bestWeight);
      obj.Set("diffWeight", data.diffWeight);
      obj.Set("cond", data.cond);
      obj.Set("speed", data.speed);
      obj.Set("speedMax", data.speedMax);
      obj.Set("stamina", data.stamina);
      obj.Set("staminaMax", data.staminaMax);
      obj.Set("guts", data.guts);
      obj.Set("gutsMax", data.gutsMax);
      obj.Set("temper", data.temper);
      obj.Set("temperMax", data.temperMax);
      obj.Set("dirt", data.dirt);
      obj.Set("health", data.health);
      obj.Set("growth", data.growth);
      obj.Set("xMonth", data.xMonth);
      array.Set(i, obj);
    }
    retData.Set("race", array);
  }
  return retData;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  Dbst::Init(env, exports);
  return exports;
}

NODE_API_MODULE(addon, Init)
